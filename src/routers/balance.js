const express = require('express')
const Balance = require('../models/balance')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/balance', auth, async (req, res) => {
    const balance = new Balance({
        ...req.body,
        owner: req.user._id
    })

    try {
        await balance.save()
        res.status(201).send(balance)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/balance', auth, async (req, res) => {
    try {
        await req.user.populate('balance').execPopulate()
        res.send(req.user.balance)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/balance/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const balance = await Balance.findOne({ _id, owner: req.user._id })

        if (!balance) {
            return res.status(404).send()
        }

        res.send(balance)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/balance/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['currentBalance', 'averageBalance','leftBalancePerMonth','leftBalanceInvested','leftBalanceInvestedAccount'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const balance = await Balance.findOne({ _id: req.params.id, owner: req.user._id})

        if (!balance) {
            return res.status(404).send()
        }

        updates.forEach((update) => balance[update] = req.body[update])
        await balance.save()
        res.send(balance)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/balance/:id', auth, async (req, res) => {
    try {
        const balance = await Balance.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!balance) {
            res.status(404).send()
        }

        res.send(balance)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router