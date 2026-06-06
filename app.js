const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));

let listaCumpleanos = [{ id: 1, nombre: 'Carmen Gloria', fecha: '1974-11-25' }];

let idContador = 2;

app.get('/', (req, res) => {
  let filasTabla = listaCumpleanos
    .map(
      (c) => `
        <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${c.nombre}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${c.fecha}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">
                <form action="/eliminar" method="POST" style="margin: 0;">
                    <input type="hidden" name="id" value="${c.id}">
                    <button type="submit" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">❌ Eliminar</button>
                </form>
            </td>
        </tr>
    `,
    )
    .join('');

  res.send(`
        <html>
        <head><title>Recordatorio de Cumpleaños</title></head>
        <body style="font-family: Arial, sans-serif; margin: 40px; background-color: #f4f7f6; color: #333;">
            <h1 style="color: #2c3e50;">🎉 Sistema de Recordatorio de Cumpleaños</h1>
            <p><b>Estudiante:</b> Carmen Gloria Muñoz Candia</p>
            <p style="background: #ecf0f1; padding: 10px; border-radius: 4px;">
                <b>Configuración del Clúster:</b> Ambiente: <span style="color: #4a90e2;">${process.env.AMBIENTE || 'Desarrollo Local'}</span> | API Key: <span style="color: #4a90e2;">${process.env.API_KEY || 'Local-Key-123'}</span>
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
                <h2>🎂 Agendar Nuevo Cumpleaños</h2>
                <form action="/guardar" method="POST">
                    <div style="margin-bottom: 10px;">
                        <label><b>Nombre:</b></label><br>
                        <input type="text" name="nombre" required style="width: 100%; padding: 8px; margin-top: 5px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label><b>Fecha de Cumpleaños:</b></label><br>
                        <input type="date" name="fecha" required style="width: 100%; padding: 8px; margin-top: 5px;">
                    </div>
                    <button type="submit" style="background: #27ae60; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">💾 Guardar Cumpleaños</button>
                </form>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2>📅 Próximos Cumpleaños Registrados</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #34495e; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Nombre</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Fecha de Cumpleaños</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center; width: 120px;">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasTabla || '<tr><td colspan="3" style="text-align:center; padding:10px;">No hay cumpleaños registrados.</td></tr>'}
                    </tbody>
                </table>
            </div>
        </body>
        </html>
    `);
});

app.get('/lab', (req, res) => {
  const ambiente = process.env.AMBIENTE || 'No configurado';
  const apiKey = process.env.API_KEY || 'No configurada';

  res.send(
    `Hola profesor! Servidor operativo. Ambiente K8s: ${ambiente} | API_KEY: ${apiKey} | Despliegue exitoso por Carmen Gloria Muñoz.`,
  );
});

app.post('/guardar', (req, res) => {
  const { nombre, fecha } = req.body;
  if (nombre && fecha) {
    listaCumpleanos.push({ id: idContador++, nombre, fecha });
    console.log(
      `[NOTIFICACIÓN] Se registró un nuevo cumpleaños para: ${nombre} (${fecha})`,
    );
  }
  res.redirect('/');
});

app.post('/eliminar', (req, res) => {
  const idParaEliminar = parseInt(req.body.id);
  const registro = listaCumpleanos.find((c) => c.id === idParaEliminar);

  if (registro) {
    listaCumpleanos = listaCumpleanos.filter((c) => c.id !== idParaEliminar);
    console.log(
      `[NOTIFICACIÓN] Se eliminó el cumpleaños de: ${registro.nombre}`,
    );
  }
  res.redirect('/');
});

setInterval(() => {
  console.log(
    '\n⏰ [SISTEMA] Ejecutando revisión matutina de alertas de cumpleaños...',
  );
  const hoy = new Date();

  listaCumpleanos.forEach((c) => {
    const cumple = new Date(c.fecha);
    cumple.setFullYear(hoy.getFullYear());

    const diferenciaTiempo = cumple.getTime() - hoy.getTime();
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 60 * 60 * 24));

    if (diferenciaDias === 0) {
      console.log(
        `🚨 [ALERTA MAÑANA] ¡HOY es el cumpleaños de ${c.nombre}! Enviando saludo oficial AM... 🎂✨`,
      );
    } else if (diferenciaDias === 2) {
      console.log(
        `📅 [RECORDATORIO 2 DÍAS ANTES] Falta poco: El cumpleaños de ${c.nombre} es en 2 días.`,
      );
    }
  });
}, 30000);

app.listen(port, () => {
  console.log(`Aplicación de Cumpleaños operativa en el puerto ${port}`);
});
