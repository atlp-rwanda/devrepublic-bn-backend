import uuid from 'uuid/v4';
import db from '../models';
import Response from '../utils/ResponseHandler';
import TripsService from '../services/tripServices';
import stringHelper from '../utils/stringHelper';
import notifService from '../services/notificationService';
import SendNotification from '../utils/sendNotification';
import StatsController from '../utils/statsCheckings';

/**
 * @description RequestController Controller
 * @class RequestController
 */
export default class requestController {
  /**
     * @description Create request method
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} request
     * @memberof requestController
     */
  static async createRequest(req, res) {
    try {
      const { user } = req;

      const {
        location, destination, reason, departureDate, gender, role, passportName
      } = req.body;
      const { email } = req.payload;
      const requestExist = await db.Request.findOne({
        where: {
          departureDate,
          email
        },
      });
      if (requestExist) {
        return Response.errorResponse(res, 409, res.__('Request already exist'));
      }
      const newRequest = await db.Request.create({
        id: uuid(),
        type: 'one way',
        managerId: user.managerId,
        userId: user.id,
        location,
        destination,
        reason,
        departureDate,
        email,
        profileData: [{
          gender,
          passportName,
          role
        }],
      });

      const managerInfo = await db.User.findOne({ where: { id: user.managerId } });

      const notification = await notifService.createNotif(
        newRequest.managerId,
        managerInfo.email,
        `A trip request to ${newRequest.destination} on ${newRequest.departureDate} has been requested by ${user.firstName}, ${user.lastName}, it is waiting your approval.`,
        '#'
      );
      const content = {
        intro: `${req.__('A trip request to')} ${newRequest.destination} ${req.__('on')} ${newRequest.departureDate} ${req.__('has been requested by')} ${newRequest.profileData[0].passportName}`,
        instruction: req.__('To view this open request, click below'),
        text: req.__('View request'),
        signature: req.__('signature')
      };

      await SendNotification.sendNotif(notification, req, content);

      return Response.success(res, 201, res.__('Request created successfully'), newRequest);
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} request
   */
  static async createReturnRequest(req, res) {
    try {
      const { user } = req;
      const {
        location,
        destination,
        departureDate,
        returnDate,
        reason,
        gender, role, passportName
      } = req.body;
      if (Date.parse(departureDate) >= Date.parse(returnDate)) {
        return Response.errorResponse(res, 400, res.__('the return date must be greater than departure date'));
      }
      const request = await db.Request.findOne({
        where: {
          email: user.email,
          departureDate
        }
      });
      if (request) return Response.errorResponse(res, 400, res.__('request with the same departure date exist'));
      const newRequest = await db.Request.create({
        id: uuid(),
        type: 'two way',
        managerId: user.managerId,
        email: user.email,
        userId: user.id,
        location: location.toLowerCase().trim(),
        destination: destination.toLowerCase().trim(),
        departureDate,
        returnDate,
        reason: reason.trim(),
        profileData: [{
          gender: gender.toLowerCase().trim(),
          passportName: passportName.toLowerCase().trim(),
          role: role.toLowerCase().trim()
        }],
      });

      const managerInfo = await db.User.findOne({ where: { id: user.managerId } });

      const notification = await notifService.createNotif(
        newRequest.managerId,
        managerInfo.email,
        `A trip request to ${newRequest.destination} on ${newRequest.departureDate} has been requested by ${user.firstName}, ${user.lastName}, it is waiting your approval.`,
        '#'
      );
      const content = {
        intro: `${req.__('A trip request to')} ${newRequest.destination} ${req.__('on')} ${newRequest.departureDate} ${req.__('has been requested by')} ${newRequest.profileData[0].passportName}`,
        instruction: req.__('To view this open request, click below'),
        text: req.__('View request'),
        signature: req.__('signature')
      };

      await SendNotification.sendNotif(notification, req, content);

      return Response.success(res, 201, res.__('Request created successfully'), newRequest);
    } catch (err) {
      return Response.errorResponse(res, 500, err.message);
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} edited request
   */
  static async editRequest(req, res) {
    try {
      const { user } = req;
      const {
        id, location, destination, departureDate, returnDate, reason,
        gender, role, passportName
      } = req.body;
      const existingRequest = await db.Request.findOne({ where: { id } });
      if (!existingRequest || existingRequest.status === 'approved' || existingRequest.status === 'rejected') {
        return Response.errorResponse(res, 404, res.__('The request does not exist or it\'s either been approved or rejected'));
      }
      if (existingRequest.email !== user.email || null) {
        return Response.errorResponse(res, 401, res.__('Only the requester of this trip can edit the trip.'));
      }
      const updatedRequest = await db.Request.update({
        location: location.toLowerCase().trim(),
        destination: destination.toLowerCase().trim(),
        departureDate,
        returnDate,
        reason: reason.trim(),
        profileData: [{
          gender: gender.toLowerCase().trim(),
          passportName: passportName.toLowerCase().trim(),
          role
        }],
      }, { where: { id }, returning: true, plain: true });
      const manager = await db.User.findOne({ where: { id: updatedRequest[1].managerId } });
      const notification = await notifService.createNotif(manager.id, manager.email, `Request with id ${updatedRequest[1].id} has been edited`, '#');
      const content = {
        intro: req.__('request with id %s has been edited', updatedRequest[1].id),
        instruction: req.__('To view this edited request click below'),
        text: req.__('View request'),
        signature: req.__('signature')
      };
      await SendNotification.sendNotif(notification, req, content);
      return Response.success(res, 200, res.__('Request updated successfully'), updatedRequest);
    } catch (err) {
      return Response.errorResponse(res, 500, req.__('server error'));
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} avail trip request
   */
  static async availTripRequests(req, res) {
    try {
      const { user } = req;
      const availableRequests = await db.Request.findAll({ where: { managerId: user.id, status: 'open' } });
      if (availableRequests.length === 0) {
        return Response.success(res, 200, res.__('No trip requests available'));
      }
      return Response.success(res, 200, res.__('Pending requests to approve'), availableRequests);
    } catch (err) {
      return Response.errorResponse(res, 500, err.message);
    }
  }

  /**
     * @description Create multi city request method
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} request
     * @memberof requestController
     */
  static async createMultiCityRequest(req, res) {
    try {
      const { user } = req;
      const {
        location, destination, reason, departureDate, stops, returnDate,
        gender, role, passportName
      } = req.body;
      const { email } = req.payload;
      const requestExist = await db.Request.findOne({
        where: {
          departureDate,
          email
        },
      });
      if (requestExist) {
        return Response.errorResponse(res, 409, 'Request already exist');
      }
      if (stops.length <= 0) {
        return Response.errorResponse(res, 400, res.__('Please provide your stops'));
      }
      if (Date.parse(departureDate) >= Date.parse(stops[0].stopArrivalDate)) {
        return Response.errorResponse(res, 400, res.__(`the arrival to ${stops[0].stopName} date must be greater than your trip departure date`));
      }
      let i;
      for (i = 0; i < stops.length; i += 1) {
        if (i < (stops.length - 1) && stops[i].stopDepartureDate > stops[i + 1].stopArrivalDate) {
          return Response.errorResponse(res, 400, res.__('Check your STOPS arrival and depature dates'));
        }
        if (stops[i].stopArrivalDate > stops[i].stopDepartureDate) {
          return Response.errorResponse(res, 400, res.__(`your departureDate at ${stops[i].stopName} has to be greater than arrival Date`));
        }
        if (Date.parse(stops[i].stopDepartureDate) >= Date.parse(returnDate)) {
          return Response.errorResponse(res, 400, res.__('Please enter valid return date according to your stops and actual departure date'));
        }
      }
      const newMulticityRequest = await db.Request.create({
        id: uuid(),
        userId: user.id,
        type: 'multi city',
        location: location.toLowerCase(),
        destination: destination.toLowerCase(),
        reason: reason.trim(),
        departureDate,
        email,
        stops,
        returnDate,
        managerId: user.managerId,
        profileData: [{
          gender: gender.toLowerCase().trim(),
          passportName: passportName.toLowerCase().trim(),
          role
        }],
      });

      const managerInfo = await db.User.findOne({ where: { id: user.managerId } });

      const notification = await notifService.createNotif(
        newMulticityRequest.managerId,
        managerInfo.email,
        `A trip request to ${newMulticityRequest.destination} on ${newMulticityRequest.departureDate} has been requested by ${user.firstName}, ${user.lastName}, it is waiting your approval.`,
        '#'
      );
      const content = {
        intro: `${req.__('A trip request to')} ${newMulticityRequest.destination} ${req.__('on')} ${newMulticityRequest.departureDate} ${req.__('has been requested by')} ${newMulticityRequest.profileData[0].passportName}`,
        instruction: req.__('To view this open request, click below'),
        text: req.__('View request'),
        signature: req.__('signature')
      };

      await SendNotification.sendNotif(notification, req, content);

      return Response.success(res, 201, res.__('Multi city request created successfully'), newMulticityRequest);
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} confirmed request
   */
  static async confirmRequest(req, res) {
    const { user } = req;
    const { requestId } = req.params;
    try {
      const request = await db.Request.findOne({
        where: {
          id: requestId
        }
      });
      if (!request) {
        return Response.errorResponse(res, 404, res.__('request not found'));
      }
      if (request.managerId !== user.id) {
        return Response.errorResponse(res, 401, res.__('you are not the assigned manager for this user'));
      }
      if (request.status === 'open') {
        return Response.errorResponse(res, 400, res.__('the request you are trying to confirm is still open'));
      }
      if (request.confirm === true) {
        return Response.errorResponse(res, 400, res.__('the request is already re-confirmed'));
      }
      const updatedRequest = await request.update({ confirm: true });

      const result = await notifService.createNotif(updatedRequest.userId, updatedRequest.email, `the trip to ${updatedRequest.destination} on ${updatedRequest.departureDate} that you requested has been ${updatedRequest.status}`, '#');

      const content = {
        intro: `${req.__('the trip to')} ${updatedRequest.destination} ${req.__('on')} ${request.departureDate} ${req.__('that you requested has been')} ${req.__(request.status)}`,
        instruction: req.__('To view this %s request you made click below', req.__(request.status)),
        text: req.__('View request'),
        signature: req.__('signature')
      };
      await SendNotification.sendNotif(result, req, content);

      return Response.success(res, 200, res.__('request re-confirmed'), updatedRequest);
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} reject request
   */
  static async rejectRequest(req, res) {
    try {
      const { user } = req;
      const { requestId } = req.params;

      const findRequest = await db.Request.findOne({
        where: { id: requestId },
      });
      if (!findRequest) {
        return Response.errorResponse(res, 404, 'Request not found');
      }
      if (findRequest.managerId !== user.id) {
        return Response.success(res, 401, res.__('This request is not yours it is for another manager'));
      }
      if (findRequest.status === 'rejected') {
        return Response.success(res, 200, res.__('Request has been already rejected'));
      }
      await db.Request.update({
        status: 'rejected'
      }, {
        where: {
          id: requestId,
          managerId: user.id
        }
      });
      return Response.success(res, 200, res.__('Request rejected successfully'));
    } catch (err) {
      return Response.errorResponse(res, 500, err.message);
    }
  }

  /**
     * @description request feature
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} array of request
     * @memberof requestController
     */
  static async requestSearch(req, res) {
    try {
      const { user } = req;
      const {
        id, location, destination, status, reason, departureDate, returnDate
      } = req.query;
      const field = {
        id,
        location,
        destination,
        status,
        reason,
        departureDate,
        returnDate
      };
      const requests = await TripsService.searchRequest(field, user);
      if (requests === stringHelper.requestNotFound) {
        return Response.errorResponse(res, 404, res.__(requests));
      }
      return Response.success(res, 200, res.__('requests found'), requests);
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @return {object} approve request
   */
  static async approveRequest(req, res) {
    const { requestId } = req.params;
    const { user } = req;
    try {
      const approvedRequest = await TripsService.approveRequest(requestId, user.id);
      if (approvedRequest === stringHelper.approveRequestNotFound) {
        return Response.errorResponse(res, 404, res.__(approvedRequest));
      }

      return Response.success(res, 200, res.__('request approved'), approvedRequest);
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} view specific trip request
   */
  static async viewRequest(req, res) {
    try {
      const { user } = req;
      const { requestId } = req.params;
      if (user.role === 'manager') {
        const availableRequest = await db.Request.findOne({
          where: {
            id: requestId,
            managerId: user.id
          }
        });
        return !availableRequest
          ? Response.errorResponse(res, 404, res.__('Request not found or not yours to manage'))
          : Response.success(res, 200, res.__('Request found'), availableRequest);
      }
      if (user.role === 'requester') {
        const Request = await db.Request.findOne({ where: { id: requestId, email: user.email } });
        return !Request
          ? Response.errorResponse(res, 404, res.__('Request not found or not yours'))
          : Response.success(res, 200, res.__('Request found'), Request);
      }
      return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @param  {object} next
   * @return {object} view all trip requests
   */
  static async viewAllRequests(req, res) {
    try {
      const { user } = req;
      if (user.role === 'manager') {
        const availableRequests = await db.Request.findAll({ where: { managerId: user.id } });
        return availableRequests.length === 0
          ? Response.errorResponse(res, 404, res.__('No trip requests available'))
          : Response.success(res, 200, res.__('Requests found'), availableRequests);
      }

      if (user.role === 'requester') {
        const Requests = await db.Request.findAll({ where: { email: user.email } });
        return Requests.length === 0
          ? Response.errorResponse(res, 404, res.__('Requests not found'))
          : Response.success(res, 200, res.__('Requests found'), Requests);
      }
      return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @description this function provides requester's trips statistics
   * @param  {object} req
   * @param  {object} res
   * @return {object} number of all created trips
   */
  static async TripStats(req, res) {
    const { user } = req;
    try {
      if (user.role === 'manager') {
        const allTrips = await db.Request.findAll({
          where: { managerId: user.id },
        });
        StatsController.stats(allTrips, res);
      }
      if (user.role === 'requester') {
        const allTrips = await db.Request.findAll({
          where: { userId: user.id },
        });
        StatsController.stats(allTrips, res);
      }
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @description this function finds and displays most travelled destinations
   * @param  {object} req
   * @param  {object} res
   * @return {object} most travelled destinations
   */
  static async mostTravelledDestinations(req, res) {
    try {
      const counting = await db.Request.findAll({
        attributes: ['destination', [db.sequelize.fn('count', db.sequelize.col('destination')), 'count']],
        group: ['Request.destination'],
        raw: true,
        order: db.sequelize.literal('count DESC'),
        where: {
          status: 'approved',
          confirm: true
        }
      });
      return Response.success(res, 200, res.__('Most travelled destinations'), { Destinations: counting });
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
   * @description this function finds and displays all booked accomodations and their ratings
   * @param  {object} req
   * @param  {object} res
   * @return {object} accomodation and their ratings
   */
  static async accommodationsAndRatings(req, res) {
    try {
      const { user } = req;
      if (user.role === 'requester') {
        const Requests = await db.Request.findAll({ where: { email: user.email } });
        const ratings = await db.Ratings.findAll({ where: { userId: user.id } });
        const allBookings = await db.Bookings.findAll({ where: { bookedBy: user.email } });
        return Response.success(res, 200, res.__('Booked Accommodations and their ratings found'),
          { Requests, ratings, allBookings });
      }
      return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }
}
