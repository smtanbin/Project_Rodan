/* Copyright (c) 2022, Witchcraft and/or its affiliates. All rights reserved. */

/******************************************************************************
 *                                Witchcraft
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
 * Author
 * Tanbin Hassan Bappi
 * 
 * NAME
 *   ValheimCore.js
 *
 * DESCRIPTION
 * Unkonwn
 *
 *****************************************************************************/
 require('dotenv').config()


const ValheimCore =()=>{
    // constructor(time) {
    // }


/******************************************************************************
 *Copyright (c) 2015, Oracle and/or its affiliates. All rights reserved.
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
 * Calling Oracle Database
 */
const oracledb = require('oracledb')
/* This one very importent. In make sure the output.*/
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
let connection
async function qurrythis(sqlqurry) {
	try {
		// oracledb.initOracleClient({ libDir: oracleClient })
		connection = await oracledb.getConnection({
			user: 'tanbin',
			password: '@urA774234',
			connectString: '10.130.102.103:1525/SBLABS'
		})
		const result = await connection.execute(sqlqurry)
		return result.rows
	} catch (err) {
		console.log('Function qurrythis face a error!')
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













}
