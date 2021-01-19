import * as express from 'express';
import { getCurrentUser, IRequest } from './helpers';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as swaggerUI from 'swagger-ui-express';
import * as swaggerJSDoc from 'swagger-jsdoc';
import * as users from '../controller/users';
import * as campaigns from '../controller/campaigns';
import * as contributions from '../controller/contributions';
import * as externalContributions from '../controller/externalContributions';
import * as activities from '../controller/activities';
import * as permissions from '../controller/permissions';
import * as expenditures from '../controller/expenditures';
import * as summary from '../controller/summary';
import { seedDb } from '../models/seeds/qaseed';

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
     * /permissions/{id}:
     *   delete:
     *     summary: Delete a user access to a campaign or government
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Permissions
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: permission removed
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/permissions/:id',
        method: 'delete',
        action: permissions.removePermission
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
     *               officeSought:
     *                 type: string
     *               firstName:
     *                 type: string
     *               lastName:
     *                 type: string
     *               email:
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
     * /campaigns/update:
     *   post:
     *     summary: Update campaign name for a government
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
     *               campaignId:
     *                 type: integer
     *               newName:
     *                 type: string
     *     responses:
     *       201:
     *         description: updated campaign name
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Campaign'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/campaigns/update',
        method: 'post',
        action: campaigns.updateCampaignName
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
        action: activities.getActivities
    },

    /**
     * @swagger
     * /contributions/{id}:
     *   put:
     *     summary: Update a contribution
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Contributions
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
     * /bulk-update-contributions:
     *   put:
     *     summary: Bulk update contributions
     *     tags:
     *       - Contributions
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
     *               currentUserId:
     *                 type: integer
     *               ids:
     *                 type: array
     *                 items: 
     *                   type: string
     *               status:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success response (X of X updated, X invalid)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/bulk-update-contributions',
        method: 'put',
        action: contributions.bulkUpdateContributions
    },

    /**
     * @swagger
     * /contributions/{id}:
     *   delete:
     *     summary: Archive a contribution
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Contributions
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
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
        method: 'delete',
        action: contributions.archiveContribution
    },
    /**
     * @swagger
     * /activities/{id}/attachment:
     *   get:
     *     summary: Download an attachment activity
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Activities
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: get response
     *         content:
     *           application/octet:
     *             schema:
     *               type: string
     *               format: binary
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/activities/:id/attachment',
        method: 'get',
        action: activities.getActivityAttachment
    },
    /**
     * @swagger
     * /contributions/new:
     *   post:
     *     summary: Add a contribution
     *     tags:
     *       - Contributions
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

    {
        /**
         * @swagger
         * /contributions/{id}/comments:
         *   post:
         *     summary: Adds a new comment on a contribution
         *     parameters:
         *       - in: path
         *         name: id
         *         required: true
         *         schema:
         *          type: integer
         *          minimum: 1
         *     tags:
         *       - Contributions
         *     security:
         *       - cookieAuth: []
         *     produces:
         *       - application/json
         *     requestBody:
         *       $ref: '#/components/requestBodies/AddCommentBody'
         *     responses:
         *       204:
         *         description: add response
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/Activity'
         *       422:
         *         $ref: '#/components/responses/UnprocessableEntity'
         *
         */
        path: '/contributions/:id/comments',
        method: 'post',
        action: contributions.createContributionComment
    },

    /**
     * @swagger
     * /expenditures/{id}/comments:
     *   post:
     *     summary: Adds a new comment on an expenditure
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Expenditures
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/AddCommentBody'
     *     responses:
     *       204:
     *         description: add response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Activity'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     *
     */
    {
        path: '/expenditures/:id/comments',
        method: 'post',
        action: expenditures.createExpenditureComment
    },

    /**
     * @swagger
     * /contributions:
     *   post:
     *     summary: Get contributions
     *     tags:
     *       - Contributions
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
     *   get:
     *     summary: Get a contribution
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Contributions
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
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
        method: 'get',
        action: contributions.getContributionById
    },

    {
        path: '/status',
        method: 'get',
        action: async (request: IRequest, response: express.Response) => {
            return response.status(200).json({ message: 'running' });
        }
    },

    /**
     * @swagger
     * /expenditures/new:
     *   post:
     *     summary: Create an expenditure
     *     tags:
     *       - Expenditures
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       $ref: '#/components/requestBodies/AddExpenditureBody'
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: post response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expenditure'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/expenditures/new',
        method: 'post',
        action: expenditures.addExpenditure
    },

    /**
     * @swagger
     * /expenditures:
     *   post:
     *     summary: Gets expenditures
     *     tags:
     *       - Expenditures
     *     security:
     *       - cookieAuth: []
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetExpenditureBody'
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: post response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expenditure'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/expenditures',
        method: 'post',
        action: expenditures.getExpenditures
    },

    /**
     * @swagger
     * /expenditures/{id}:
     *   put:
     *     summary: Update an expenditure
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Expenditures
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/UpdateExpenditureBody'
     *     responses:
     *       204:
     *         description: update response
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Expenditure'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/expenditures/:id',
        method: 'put',
        action: expenditures.updateExpenditure
    },

    /**
     * @swagger
     * /bulk-update-expenditures:
     *   put:
     *     summary: Bulk update expenditures
     *     tags:
     *       - Expenditures
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
     *               currentUserId:
     *                 type: integer
     *               ids:
     *                 type: array
     *                 items: 
     *                   type: string
     *               status:
     *                 type: string
     *     responses:
     *       200:
     *         description: Success response (X of X updated, X invalid)
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/bulk-update-expenditures',
        method: 'put',
        action: expenditures.bulkUpdateExpenditures
    },
    /**
     * @swagger
     * /expenditures/{id}:
     *   get:
     *     summary: Get an expenditure
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Expenditures
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: get response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Expenditure'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/expenditures/:id',
        method: 'get',
        action: expenditures.getExpenditureById
    },
    /**
     * @swagger
     * /summary:
     *   post:
     *     summary: Get the summary of status for expenditures and contributions by campaingId or governmentId
     *     tags:
     *       - Summary
     *     requestBody:
     *       $ref: '#/components/requestBodies/GetStatusSummaryBody'
     *     responses:
     *       200:
     *         description: summary object
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/StatusSummary'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     *
     */
    {
        path: '/summary',
        method: 'post',
        action: summary.getSummary
    },
    {
        path: '/seed',
        method: 'get',
        action: async (request: IRequest, response: express.Response) => {
            const message = await seedDb();
            return response.status(200).json(message);
        }
    },
    /**
     * @swagger
     *
     * /matches/{id}:
     *   get:
     *     summary: Get matches by contribution id
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *          type: integer
     *          minimum: 1
     *     tags:
     *       - Contributions
     *       - Match
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: get response
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Contribution'
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     */
    {
        path: '/matches/:id',
        method: 'get',
        action: contributions.getMatchesByContributionId
    },
    /**
     * @swagger
     *
     * /matches:
     *   post:
     *     summary: Updates a contribution with match information
     *     tags:
     *       - Contributions
     *       - Match
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     requestBody:
     *       $ref: '#/components/requestBodies/PostMatchBody'
     *     responses:
     *       204:
     *         description: match successful
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     */
    {
        path: '/matches',
        method: 'post',
        action: contributions.postMatchResult
    },
    /**
     * @swagger
     *
     * /contributionsgeo:
     *   get:
     *     summary: Get a public feed contributions in geojson format
     *     tags:
     *       - Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     parameters:
     *      - in: query
     *        name: to
     *        schema:
     *          type: string
     *      - in: query
     *        name: from
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: query
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     */
    {
        path: '/contributionsgeo',
        method: 'get',
        action: contributions.getContributionsGeo
    },
    /**
     * @swagger
     *
     * /external-contributionsgeo:
     *   get:
     *     summary: Get a public feed of external contributions in geojson format
     *     tags:
     *       - Contribution
     *       - External Contribution
     *     security:
     *       - cookieAuth: []
     *     produces:
     *       - application/json
     *     parameters:
     *      - in: query
     *        name: to
     *        schema:
     *          type: string
     *      - in: query
     *        name: from
     *        schema:
     *          type: string
     *     responses:
     *       200:
     *         description: query
     *       422:
     *         $ref: '#/components/responses/UnprocessableEntity'
     */
    {
        path: '/external-contributionsgeo',
        method: 'get',
        action: externalContributions.getExternalContributionsGeo
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
