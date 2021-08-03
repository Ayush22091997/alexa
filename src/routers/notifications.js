const express = require('express')
const Notifications = require('../models/notifications')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/notifications', auth, async (req, res) => {
    const notifications = new Notifications({
        ...req.body,
        owner: req.user._id
    })

    try {
        await notifications.save()
        res.status(201).send(notifications)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/notifications', auth, async (req, res) => {
    try {
        await req.user.populate('notifications').execPopulate()
        res.send(req.user.notifications)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/notifications/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const notifications = await Notifications.findOne({ _id, owner: req.user._id })

        if (!notifications) {
            return res.status(404).send()
        }

        res.send(notifications)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/notifications/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['notification']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const notification = await Notifications.findOne({ _id: req.params.id, owner: req.user._id})

        if (!notification) {
            return res.status(404).send()
        }

        updates.forEach((update) => notification[update] = req.body[update])
        await notification.save()
        res.send(notification)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/notifications/:id', auth, async (req, res) => {
    try {
        const notification = await Notifications.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!notification) {
            res.status(404).send()
        }

        res.send(notification)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router