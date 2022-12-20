const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));


 async function haveCodeforces(username,email_id) {
    return new Promise(async (resolve,reject) => {
        const url = "https://codeforces.com/api/user.info?handles="+username;
    await fetch(url)
    .then((response) => {return response.json()})
    .then(response => {
         console.log(response);
         if ( response.status === "OK") {
             if ( response.result[0].email === undefined ) {
                 resolve( {
                     code: 404,
                     message: "Please make your email public in codeforces settings"
                 })
             } else {
                  if ( response.result[0].email === email_id ) {
                     resolve( {
                         code: 200,
                         message: "valid user"
                     })
                  } else {
                      resolve( {
                         code: 404,
                         message: "Invalid user"
                      })
                  }
             }
         } else {
             resolve( {
                 code: 404,
                 message: response.comment
             })
         }
    }).catch(err => {
         reject( {
             code: 404,
             message: err
         })
    })
 })
    
}


module.exports = {
     haveCodeforces
}