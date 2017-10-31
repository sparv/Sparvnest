# API Documentation

## Introduction

This document describes the API endpoints of Sparvnest.
It is based on the OpenAPI specs https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#securitySchemeObject .

The media type specification is `application/json`.

The API endpoints are structured in stages.
Endpoints in stage 1 dont need an Bearer token for authorization and are usually the first contact with the backend.
Stage 2 defined the points where a Bearer token is needed for authorization. These routes process data relating to the user of sparvapp.
Stage 3 routes also need a bearer auth token. These are endpoints which are not directly pointing to the user, but handling data which is related with the user.

The FORMAT value specifies what kind of properties the value has, for example the `FORMAT: email` implies that the string will be a valid email adress and only this will be accepted on the server side respectively will be returned only in that format.
If no FORMAT is specified, it will fall back to default properties (for example for a STRING, any valid string will be accepted).

## General specifications

## Stage 1

---

- [POST] `/login`
*PROVIDE*
email: STRING (FORMAT: email)
password: STRING (FORMAT: password)

*RETURN*
**ON SUCCESS:**
id: STRING (FORMAT: UUID)
fullname: STRING
token: STRING (FORMAT: JWT TOKEN)

**ON ERROR:**
fullname: NULL
token: NULL

---

- [POST] `/register`
*PROVIDE*
email: STRING
password: STRING
fullname: STRING

*RETURN*

## Stage 2

- [GET] `/user/:USER_ID`
*PROVIDE*
- [POST] `/user/:USER_ID/update`
*PROVIDE*
- [POST] `/user/:USER_ID/delete`
*PROVIDE*
- [GET] `/user/:USER_ID/validate`
*PROVIDE*

## Stage 3

- [GET] `/user/:USER_ID/customer/all/view` // get customer overview
*PROVIDE*
- [GET] `/user/:USER_ID/customer/:CUSTOMER_ID/view`
*PROVIDE*
- [POST] `/user/:USER_ID/customer/:CUSTOMER_ID/add`
*PROVIDE*
- [POST] `/user/:USER_ID/customer/:CUSTOMER_ID/edit`
*PROVIDE*
- [POST] `/user/:USER_ID/customer/:CUSTOMER_ID/delete`
*PROVIDE*
