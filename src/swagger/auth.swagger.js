/**
 * @swagger
 * definitions:
 *   register:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 */
/**
 * @swagger
 * /:
 *   get:
 *     description: Display welcome message
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Welcome to devRepublic Barefoot Nomad API
 */
/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - User
 *     name: Signup
 *     summary: Signup a user in a system
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/register'
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - firstName
 *           - lastName
 *           - email
 *           - password
 *     responses:
 *       '201':
 *             description: User created.
 *       '400':
 *             description: Bad request.
 *       '409':
 *             description: User already exist.
 * */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - User
 *     name: login
 *     summary: login a user in a system
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/login'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *         required:
 *           - email
 *           - password
 *     responses:
 *       '200':
 *             description: User logged in.
 *       '400':
 *             description: Bad request.
 *       '401':
 *             description: Incorrect email or password.
 * */

/**
 * @swagger
 * definitions:
 *   login:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - email
 *         - password
 */