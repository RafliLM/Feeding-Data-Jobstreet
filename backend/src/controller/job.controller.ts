import { Router } from "express";
import jobService from "../service/job.service";
import { body, query, validationResult } from 'express-validator';
import { BadRequestError } from "../exception/errors/BadRequest.error";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: The Feeding data Jobstreet API
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get jobs data with pagination and keyword filter
 *     tags: [Jobs]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page of pagination
 *       - name: size
 *         in: query
 *         schema:
 *           type: integer
 *         required: true
 *         description: Size of pagination
 *       - name: keyword
 *         in: query
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter jobs by given keyword
 * 
 *     responses:
 *       200:
 *         description: The list of jobs data and number of total data.
 *       500:
 *         description: Internal Server Error.
 *
 */
router.get('/' , 
    query('page').isNumeric().withMessage("Parameter Page can't be empty!"), 
    query('size').isNumeric().withMessage("Parameter Size can't be empty!"), 
    async (req, res, next) => {
    try {
        const validate = validationResult(req)
        if (!validate.isEmpty()){
            throw new BadRequestError(validate.array()[0].msg)
        }
        const page : number = parseInt(req.query!.page as string)
        const size : number = parseInt(req.query!.size as string)
        return res.status(200).json(await jobService.getJobs(page, size, req.query!.keyword as string))
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /jobs/scrape/{keyword}:
 *   get:
 *     summary: Scrape data from jobstreet based on certain keyword
 *     tags: [Jobs]
 *     parameters:
 *       - name: keyword
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to scrape data from Jobstreet
 * 
 *     responses:
 *       200:
 *         description: Total data which successfully scraped.
 *       500:
 *         description: Internal Server Error.
 *
 */
router.get('/scrape/:keyword', async (req, res, next) => {
    try {
        return res.status(200).send(await jobService.scrapeData(req.params.keyword))
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /jobs/excel:
 *   get:
 *     summary: Generate an Excel file which contains all data in the database
 *     tags: [Jobs]
 * 
 *     responses:
 *       200:
 *         description: An excel file containing all data.
 *       500:
 *         description: Internal Server Error.
 *
 */
router.get('/excel', async (req, res, next) => {
    try {
        const excel = await jobService.generateExcelReport()
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", `attachment; filename=job-report-${Date.now()}.xlsx`);
        res.header('Access-Control-Expose-Headers', 'Content-Disposition');
        await excel.xlsx.write(res)
        return res.end()
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       content: 
 *         application/json:
 *           schema:
 *             required:
 *               - title
 *               - teaser
 *               - companyName
 *               - location
 *               - workType
 *               - salary
 *               - role
 *               - keyword
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               teaser:
 *                 type: string
 *               companyName:
 *                 type: string
 *               location:
 *                 type: string
 *               workType:
 *                 type: string
 *               salary:
 *                 type: string
 *               role:
 *                 type: string
 *               keyword:
 *                 type: string
 *               bulletPoints:
 *                 type: Array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Successfully created a new job data.
 *       500:
 *         description: Some server error
 *
 */
router.post('/',
    body('title').notEmpty().withMessage("Title can't be empty!"),
    body('teaser').notEmpty().withMessage("Teaser can't be empty!"),
    body('companyName').notEmpty().withMessage("CompanyName can't be empty!"),
    body('location').notEmpty().withMessage("Location can't be empty!"),
    body('workType').notEmpty().withMessage("WorkType can't be empty!"),
    body('salary').notEmpty().withMessage("Salary can't be empty!"),
    body('role').notEmpty().withMessage("Role can't be empty!"),
    body('keyword').notEmpty().withMessage("Keyword can't be empty!"),
    body('bulletPoints').isArray().withMessage("BulletPoints should be an array of strings!"),
    async (req, res, next) => {
    try {
        const validate = validationResult(req)
        if (!validate.isEmpty()){
            throw new BadRequestError(validate.array()[0].msg)
        }
        let data : {
            title: string,
            teaser: string | undefined,
            companyName: string,
            location: string,
            workType: string,
            role: string,
            salary: string,
            keyword: string,
            listingDate: Date,
            bulletPoints: string []
        } = req.body
        data.listingDate = new Date()
        if ('id' in data)
            delete data['id']
        return res.status(201).send(await jobService.addJob(data))
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /jobs/{jobId}:
 *   put:
 *     summary: Update a job data
 *     tags: [Jobs]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: jobId of the job data to be updated
 *     requestBody:
 *       content: 
 *         application/json:
 *           schema:
 *             required:
 *               - title
 *               - teaser
 *               - companyName
 *               - location
 *               - workType
 *               - salary
 *               - role
 *               - keyword
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               teaser:
 *                 type: string
 *               companyName:
 *                 type: string
 *               location:
 *                 type: string
 *               workType:
 *                 type: string
 *               salary:
 *                 type: string
 *               role:
 *                 type: string
 *               keyword:
 *                 type: string
 *               bulletPoints:
 *                 type: Array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Successfully updated the job data.
 *       404:
 *         description: JobId not found.
 *       500:
 *         description: Some server error
 *
 */
router.put('/:jobId',
    body('title').notEmpty().withMessage("Title can't be empty!"),
    body('teaser').notEmpty().withMessage("Teaser can't be empty!"),
    body('companyName').notEmpty().withMessage("CompanyName can't be empty!"),
    body('location').notEmpty().withMessage("Location can't be empty!"),
    body('workType').notEmpty().withMessage("WorkType can't be empty!"),
    body('salary').notEmpty().withMessage("Salary can't be empty!"),
    body('role').notEmpty().withMessage("Role can't be empty!"),
    body('keyword').notEmpty().withMessage("Keyword can't be empty!"),
    body('listingDate').notEmpty().withMessage("ListingDate can't be empty!"),
    body('bulletPoints').isArray().withMessage("BulletPoints should be an array of strings!"),
    async (req, res, next) => {
    try {
        const data : {
            title: string,
            teaser: string | undefined,
            companyName: string,
            location: string,
            workType: string,
            role: string,
            salary: string,
            keyword: string,
            listingDate: Date,
            bulletPoints: string []
        } = req.body
        if ('id' in data)
            delete data['id']
        return res.status(200).send(await jobService.editJob(parseInt(req.params!.jobId), data))
    } catch (error) {
        next(error)
    }
})

/**
 * @swagger
 * /jobs/{jobId}:
 *   delete:
 *     summary: 
 *     tags: [Jobs]
 *     parameters:
 *       - name: jobId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *         description: jobId of the job data to be deleted
 * 
 *     responses:
 *       200:
 *         description: Successfully deleted the job data.
 *       404:
 *         description: JobId not found.
 *       500:
 *         description: Internal Server Error.
 *
 */
router.delete('/:jobId', async (req, res, next) => {
    try {
        return res.status(200).send(await jobService.deleteJob(parseInt(req.params.jobId)))
    } catch (error) {
        next(error)
    }
})

export default router