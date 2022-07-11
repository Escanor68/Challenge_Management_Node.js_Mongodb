const texto = datosParaElMail => `<html>
    <head>
    <title>Enroll</title>
    </head>
        <body>
            <h1>Enroll successfully</h1>
                <p>The enroll has been successfully</p>
                <p>It will touch you in the commission:${datosParaElMail}</p>
        </body>
    </html>`;

module.exports = texto;
