'use strict';

const Promise = require('bluebird') // Promise library
const expect = require('chai').expect // Assertion library

// Init API instance
const api = require('../index')({ version: 'v1.0' })


// NOTE: Set test to true
api._test = true;

let event = {
  httpMethod: 'get',
  path: '/test',
  body: {},
  headers: {
    'Content-Type': 'application/json'
  }
}


/******************************************************************************/
/***  DEFINE TEST ROUTES                                                    ***/
/******************************************************************************/

api.get('/modified', function(req,res) {
  res.modified().send('cache')
})

api.get('/modifiedTrue', function(req,res) {
  res.modified(true).send('cache')
})

api.get('/modifiedFalse', function(req,res) {
  res.modified(false).send('cache')
})

api.get('/modifiedDate', function(req,res) {
  res.modified(new Date('2018-08-01')).send('cache')
})

api.get('/modifiedString', function(req,res) {
  res.modified('2018-08-01').send('cache')
})

api.get('/modifiedBadString', function(req,res) {
  res.modified('test').send('cache')
})

/******************************************************************************/
/***  BEGIN TESTS                                                           ***/
/******************************************************************************/

describe('modified Tests:', function() {

  it('modified (no options)', async function() {
    let _event = Object.assign({},event,{ path: '/modified' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json',
        'last-modified': result.headers['last-modified']
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })
    expect(typeof result.headers['last-modified']).to.not.be.null
    expect(typeof result.headers['last-modified']).to.not.be.empty
  }) // end it

  it('modified (true)', async function() {
    let _event = Object.assign({},event,{ path: '/modifiedTrue' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json',
        'last-modified': result.headers['last-modified']
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })
    expect(typeof result.headers['last-modified']).to.not.be.null
    expect(typeof result.headers['last-modified']).to.not.be.empty
  }) // end it

  it('modified (false)', async function() {
    let _event = Object.assign({},event,{ path: '/modifiedFalse' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json'
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })
  }) // end it

  it('modified (date)', async function() {
    let _event = Object.assign({},event,{ path: '/modifiedDate' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json',
        'last-modified': 'Wed, 01 Aug 2018 00:00:00 GMT'
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })
  }) // end it

  it('modified (string)', async function() {
    let _event = Object.assign({},event,{ path: '/modifiedString' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json',
        'last-modified': 'Wed, 01 Aug 2018 00:00:00 GMT'
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })

  }) // end it

  it('modified (invalid date)', async function() {
    let _event = Object.assign({},event,{ path: '/modifiedBadString' })
    let result = await new Promise(r => api.run(_event,{},(e,res) => { r(res) }))
    expect(result).to.deep.equal({
      headers: {
        'content-type': 'application/json',
        'last-modified': result.headers['last-modified']
      },
      statusCode: 200,
      body: 'cache',
      isBase64Encoded: false
    })
    expect(new Date(result.headers['last-modified'])).to.be.above(new Date('2018-08-02'))

  }) // end it

}) // end lastModified tests
