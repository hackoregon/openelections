import * as express from 'express';
import { getCurrentUser, IRequest } from './helpers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as swaggerUI from 'swagger-ui-express';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as users from '../controller/users';
import * as campaigns from '../controller/campaigns';
import * as contributions from '../controller/contributions';
import * as activities from '../controller/activities';

export const AppRoutes = [
    /**
     * @swagger
     * /me:
     *   get:
     *     summary: Get current user
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: the current user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *
     */
    {
        path: '/me',
        method: 'get',
        action: async (request: IRequest, response: express.Response) => {
            return response.status(200).json(request.currentUser);
        }
    },

    /**
     * @swagger
     * /users/login:
     *   post:
     *     summary: Log in to the application
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/LoginBody'
     *     responses:
     *       204:
     *         description: login successful
     *       401:
     *         $ref: '#/components/responses/Unauthorized'
     *
     */
    {
        path: '/users/login',
        method: 'post',
        action: users.login
    },

    /**
     * @swagger
     * /users/invite:
     *   post:
     *     summary: Invite a user to a government or campaign
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/NewUser'
     *     responses:
     *       201:
     *         description: invite sent
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/invite',
        method: 'post',
        action: users.invite
    },

    /**
     * @swagger
     * /users/resend-invite:
     *   post:
     *     summary: Resend invite to a user
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               userId:
     *                 type: integer
     *     responses:
     *       201:
     *         description: invite re-sent
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/resend-invite',
        method: 'post',
        action: users.resendInvite
    },

    /**
     * @swagger
     * /users/redeem-invite:
     *   post:
     *     summary: Redeem an invitation to join a campaign or government
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/RedeemInviteBody'
     *     responses:
     *       204:
     *         description: invite redeemed
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/redeem-invite',
        method: 'post',
        action: users.redeemInvite
    },

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Get a list of users for a campaign or government
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetUsersBody'
     *     responses:
     *       200:
     *         description: list of users
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/User'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users',
        method: 'post',
        action: users.getUsers
    },

    /**
     * @swagger
     * /users/send-password-reset-email:
     *   post:
     *     summary: Send a password reset email to a user
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *     responses:
     *       204:
     *         description: password reset email sent
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/send-password-reset-email',
        method: 'post',
        action: users.sendPasswordReset
    },

    /**
     * @swagger
     * /users/reset-password:
     *   post:
     *     summary: Reset a user's password
     *     tags:
     *       - Users
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               invitationCode:
     *                 type: string
     *               password:
     *                 type: string
     *                 format: password
     *     responses:
     *       204:
     *         description: password reset
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/reset-password',
        method: 'post',
        action: users.resetPassword
    },

    /**
     * @swagger
     * /users/password:
     *   put:
     *     summary: Update a user's password
     *     tags:
     *       - Users
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               currentPassword:
     *                 type: string
     *                 format: password
     *               newPassword:
     *                 type: string
     *                 format: password
     *     responses:
     *       204:
     *         description: password updated
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/users/password',
        method: 'put',
        action: users.updatePassword
    },

    /**
     * @swagger
     * /campaigns:
     *   post:
     *     summary: Get a list of campaigns for a government
     *     tags:
     *       - Campaigns
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               governmentId:
     *                 type: integer
     *     responses:
     *       200:
     *         description: list of campaigns
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Campaign'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/campaigns',
        method: 'post',
        action: campaigns.getCampaigns
    },

    /**
     * @swagger
     * /campaigns/new:
     *   post:
     *     summary: Create a campaign for a government
     *     tags:
     *       - Campaigns
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               governmentId:
     *                 type: integer
     *               name:
     *                 type: string
     *     responses:
     *       201:
     *         description: newly created campaign
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Campaign'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/campaigns/new',
        method: 'post',
        action: campaigns.addCampaign
    },

    /**
     * @swagger
     * /activities:
     *   post:
     *     summary: Get a list of activities for a campaign or government
     *     tags:
     *       - Activities
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetActivitiesBody'
     *     responses:
     *       200:
     *         description: list of activities
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Activity'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/activities',
        method: 'post',
        action: activities.activities
    },

    /**
     * @swagger
     * /contributions/{id}:
     *   put:
     *     summary: Update a contribution
     *     tags:
     *       - Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/UpdateContributionBody'
     *     responses:
     *       204:
     *         description: update response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Contribution'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/contributions/:id',
        method: 'put',
        action: contributions.updateContribution
    },

    /**
     * @swagger
     * /contributions/new:
     *   post:
     *     summary: Add a contribution
     *     tags:
     *       - Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/AddContributionBody'
     *     responses:
     *       204:
     *         description: add response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Contribution'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/contributions/new',
        method: 'post',
        action: contributions.addContribution
    },

    /**
     * @swagger
     * /contributions:
     *   post:
     *     summary: Get contributions
     *     tags:
     *       - Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetContributionBody'
     *     responses:
     *       204:
     *         description: add response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Contribution'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/contributions',
        method: 'post',
        action: contributions.getContributions
    },

    /**
     * @swagger
     * /contributions/{id}:
     *   post:
     *     summary: Get a contribution
     *     tags:
     *       - Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetContributionByIdBody'
     *     responses:
     *       200:
     *         description: get response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Contribution'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/contributions/:id',
        method: 'post',
        action: contributions.getContributionById
    }
];

export const setupRoutes = (app: express.Express) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(getCurrentUser);
    app.use(
        '/api-docs',
        swaggerUI.serve,
        swaggerUI.setup(
            swaggerJSDoc({
                definition: {
                    openapi: '3.0.0',
                    info: {
                        title: 'Open Elections',
                        version: '1.0.0'
                    }
                },
                apis: ['routes/*']
            })
        )
    );
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: IRequest, response: express.Response, next: Function) => {
            route
                .action(request, response, next)
                .then(() => next)
                .catch(err => next(err));
        });
    });
};
