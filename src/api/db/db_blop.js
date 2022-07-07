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
 *
 *
 *	Calling Oracle Database */
const oracledb = require("oracledb")

async function qurryBlob(sqlqurry) {
  oracledb.fetchAsBuffer = [oracledb.BLOB]
  let connection
  // try {
  //   // oracledb.initOracleClient({ libDir: oracleClient })
  //   connection = await oracledb.getConnection({
  //     user: process.env.DBUSER,
  //     password: process.env.DBPASSWD,
  //     connectString: process.env.DBLINK,
  //   })

  //   //read all rows and get an array of objects with all data
  //   connection.query(sqlqurry, [110], function onResults(error, results) {
  //     if (error) {
  //       //handle error...
  //       console.log("Error in blop qurry function 'code/db.js'")
  //     } else {
  //       return
  //     }
  //   })
  // } finally {
  //   if (connection) {
  //     try {
  //       await connection.close()
  //     } catch (err) {
  //       // console.log('Function connection.close() face a error!')
  //       // console.error(err)
  //     }
  //   }
  // }
  try {
    // oracledb.initOracleClient({ libDir: oracleClient })
    connection = await oracledb.getConnection({
      user: process.env.DBUSER,
      password: process.env.DBPASSWD,
      connectString: process.env.DBLINK,
    })
    const result = await connection.execute(sqlqurry)
    return result.rows
  } catch (err) {
    console.log("Function qurrythis face a error!")
    console.error(err)
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        // console.log('Function connection.close() face a error!')
        // console.error(err)
      }
    }
  }
}

/*****************************************************************************/

module.exports = qurryBlob
