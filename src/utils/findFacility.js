import { Sequelize } from 'sequelize';
import db from '../models';

const { Op } = Sequelize;
const findFacilityHandlder = async (accomodation, facilityName, destination) => {
  const facility = await db.Facilities.findOne({
    where: {
      id: accomodation,
      facilityName,
      location: {
        [Op.iLike]: `%${destination}%`
      }
    }
  });
  return facility;
};
export default findFacilityHandlder;
