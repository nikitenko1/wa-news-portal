const authEmail = (header, url) => {
  const data = `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px; overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #0000FF">
        <h2 style="font-size:2em;text-decoration:none;font-weight:900;color:#0D6EFD;">${header}</h2>
      </div>
       
      <p>Please click below button to proceed the chosen action</p>
      <a style="display: block; text-decoration: none; background: #0D6EFD;; color: #fff; width:50%;
       border-radius: 10px; height: 35px; text-align: center; line-height: 35px; margin-top: 15px"
       href=${url}>verify the email address</a>
      <div style="float:right;padding:8px 0;font-size:0.8em;line-height:1;font-weight:300">
        <div style="margin-top: 20px;">
          <hr style="background: #0000FF;"/>
          <p>All the best,</p>
          <p>- JSC GlobalPal Service | Kyiv Team -</p>
        </div>
      </div>
    </div>
  </div>`;
  return data;
};

module.exports = authEmail;
