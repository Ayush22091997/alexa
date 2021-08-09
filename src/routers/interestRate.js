const express = require('express')
const interestRate = require('../models/interestRate')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/rate', auth, async (req, res) => {
    const rates = new interestRate({
        ...req.body
    })

    try {
        await rates.save()
        res.status(201).send(rates)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/rate/:account', auth, async (req, res) => {
    try {
        console.log(req.params.account);
        const rate=await interestRate.find({name:req.params.account});
        res.send(rate)
    } catch (e) {
        res.status(500).send()
    }
})

router.put('/changeRate', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['rate','name']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const rate = await interestRate.findOne({name:req.body.name})

        if (!rate) {
            return res.status(404).send()
        }

        updates.forEach((update) => rate[update] = req.body[update])
        await rate.save()
        res.send(rate)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/rate', auth, async (req, res) => {
    try {
        const rate = await interestRate.findOneAndDelete({ name:req.body.name })

        if (!rate) {
            res.status(404).send()
        }

        res.send(rate)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router