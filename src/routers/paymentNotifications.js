const express = require('express')
const Payments = require('../models/paymentNotifications')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/payments', auth, async (req, res) => {
    const payments = new Payments({
        ...req.body,
        owner: req.user._id
    })

    try {
        await payments.save()
        res.status(201).send(payments)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/payments', auth, async (req, res) => {
    try {
        await req.user.populate('payments').execPopulate()
        res.send(req.user.payments)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/payments/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const payments = await Payments.findOne({ _id, owner: req.user._id })

        if (!payments) {
            return res.status(404).send()
        }

        res.send(payments)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/payments/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['paymentStatus']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const payments = await Payments.findOne({ _id: req.params.id, owner: req.user._id})

        if (!payments) {
            return res.status(404).send()
        }

        updates.forEach((update) => payments[update] = req.body[update])
        await payments.save()
        res.send(payments)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/payments/:id', auth, async (req, res) => {
    try {
        const payments = await Payments.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!payments) {
            res.status(404).send()
        }

        res.send(payments)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router