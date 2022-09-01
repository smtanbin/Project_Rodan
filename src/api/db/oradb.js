/* Environment veriable */
require("dotenv").config()

/* Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * NAME
 *   Oracle Database Connection for Nodejs.
 *
 * DESCRIPTION
 *
 * Ref: https://oracle.github.io/node-oracledb/INSTALL.html#instwin
 *
 *	Calling Oracle Database */
const oracledb = require("oracledb")


/* Qurry Function */
async function oradb(sqlqurry) {
  oracledb.autoCommit = true
  // This one very importent. In make sure the output.
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
  //connectString

  return new Promise(async (resolve, reject) => {
    try {
      let connection = await oracledb.getConnection({
        user: process.env.DBUSER,
        password: process.env.DBPASSWD,
        connectString: process.env.DBLINK,
      })
      connection
        .execute(sqlqurry)
        .then((result) => resolve(result.rows))
        .finally((result) => connection.close())
    } catch (err) {
      reject("Error from Oracle ==>" + err)
    }
  })
}

module.exports = { oradb }
