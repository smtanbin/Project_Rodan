const qurrythis = require('./db')
const roleCheck = async (user) => {
	sql = `SELECT USERNAME, ROLE 
    FROM (
        (SELECT UPPER (USERID)     USERID,
        USERNAME,
        UPASS,
        UPPER (ROLEID)     ROLE,
        'null' ROOT
        FROM AGENT_BANKING.USER_INFO)
      
        UNION
      
        (SELECT UPPER (MPHONE)     USERID,
             NAME               USERNAME,
             R.PIN_NO           UPASS,	
             'AGENT' ROLE,
             MPHONE ROOT
             FROM AGENT_BANKING.REGINFO R)
             
             UNION
             
             (SELECT UPPER (EMPID)     USERID,
             NAME               USERNAME,
             E.PIN_NO         UPASS,	
             'USER' ROLE,
             CREATE_BY ROOT
             FROM AGENT_BANKING.EMPINFO E
             WHERE STATUS = 'A')
             )
             WHERE USERID = UPPER ('${user}')
             ORDER BY ROLE DESC `
	try {
		return await qurrythis(sql)
	} catch (e) {
		console.log(e)
		return e
	}
}
module.exports = { roleCheck }
