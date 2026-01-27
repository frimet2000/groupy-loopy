// @ts-nocheck
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Helper function to send email via Gmail API
async function sendEmailViaGmail(accessToken, to, subject, htmlBody) {
  const emailLines = [
    `To: ${to}`,
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    htmlBody
  ];
  
  const email = emailLines.join('\r\n');
  const encodedEmail = btoa(unescape(encodeURIComponent(email)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedEmail })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API error: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { registrationId, token, newSelectedDays, language = 'he' } = await req.json();

    if (!registrationId || !token || !newSelectedDays) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get registration
    const registration = await base44.asServiceRole.entities.NifgashimRegistration.get(registrationId);
    
    if (!registration) {
      return Response.json({ error: 'Registration not found' }, { status: 404 });
    }

    // Verify token
    if (registration.edit_token !== token) {
      return Response.json({ error: 'Invalid token' }, { status: 403 });
    }

    // Extract day numbers only
    const newSelectedDayNumbers = newSelectedDays.map(d => d.day_number);

    // Update registration - DO NOT CHANGE PAYMENT AMOUNTS
    await base44.asServiceRole.entities.NifgashimRegistration.update(registrationId, {
      selectedDays: newSelectedDays,
      selected_days: newSelectedDayNumbers
    });

    // Send confirmation email
    const translations = {
      he: {
        subject: 'עדכון ימי מסע - נפגשים בשביל ישראל',
        greeting: 'שלום,',
        updated: 'ימי המסע שלך עודכנו בהצלחה!',
        newDays: 'הימים החדשים שנבחרו:',
        questions: 'שאלות? צור קשר:',
        email: 'info@nifgashim.org.il',
        team: 'צוות נפגשים בשביל ישראל'
      },
      en: {
        subject: 'Trek Days Updated - Nifgashim for Israel',
        greeting: 'Hello,',
        updated: 'Your trek days have been successfully updated!',
        newDays: 'New selected days:',
        questions: 'Questions? Contact:',
        email: 'info@nifgashim.org.il',
        team: 'Nifgashim for Israel Team'
      },
      ru: {
        subject: 'Дни похода обновлены - Nifgashim для Израиля',
        greeting: 'Привет,',
        updated: 'Ваши дни похода успешно обновлены!',
        newDays: 'Новые выбранные дни:',
        questions: 'Вопросы? Контакт:',
        email: 'info@nifgashim.org.il',
        team: 'Команда Nifgashim для Израиля'
      },
      es: {
        subject: 'Días del trek actualizados - Nifgashim para Israel',
        greeting: 'Hola,',
        updated: '¡Tus días de trek han sido actualizados con éxito!',
        newDays: 'Nuevos días seleccionados:',
        questions: '¿Preguntas? Contacto:',
        email: 'info@nifgashim.org.il',
        team: 'Equipo Nifgashim para Israel'
      },
      fr: {
        subject: 'Jours de trek mis à jour - Nifgashim pour Israël',
        greeting: 'Bonjour,',
        updated: 'Vos jours de trek ont été mis à jour avec succès!',
        newDays: 'Nouveaux jours sélectionnés:',
        questions: 'Questions? Contact:',
        email: 'info@nifgashim.org.il',
        team: 'Équipe Nifgashim pour Israël'
      },
      de: {
        subject: 'Trek-Tage aktualisiert - Nifgashim für Israel',
        greeting: 'Hallo,',
        updated: 'Ihre Trek-Tage wurden erfolgreich aktualisiert!',
        newDays: 'Neue ausgewählte Tage:',
        questions: 'Fragen? Kontakt:',
        email: 'info@nifgashim.org.il',
        team: 'Nifgashim für Israel Team'
      },
      it: {
        subject: 'Giorni del trek aggiornati - Nifgashim per Israele',
        greeting: 'Ciao,',
        updated: 'I tuoi giorni di trek sono stati aggiornati con successo!',
        newDays: 'Nuovi giorni selezionati:',
        questions: 'Domande? Contatto:',
        email: 'info@nifgashim.org.il',
        team: 'Team Nifgashim per Israele'
      }
    };

    const t = translations[language] || translations.he;

    // Build days list HTML
    const sortedDays = [...newSelectedDays].sort((a, b) => a.day_number - b.day_number);
    const daysHtml = sortedDays.map(day => {
      const date = day.date ? new Date(day.date).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }) : '';
      return `<tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 12px 8px;">
          <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; width: 32px; height: 32px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; font-weight: bold;">
            ${day.day_number}
          </span>
        </td>
        <td style="padding: 12px 8px;">
          <div style="font-weight: 600;">${day.daily_title || ''}</div>
          <div style="font-size: 12px; color: #64748b;">📅 ${date}</div>
        </td>
      </tr>`;
    }).join('');

    const emailBody = `
<!DOCTYPE html>
<html dir="${language === 'he' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 24px;">✅ ${t.updated}</h1>
    </div>
    
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
      <p style="font-size: 18px; color: #1e293b;">${t.greeting}</p>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <h3 style="color: #1e293b; margin-top: 0;">🗓️ ${t.newDays}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${daysHtml}
        </table>
      </div>

      <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin-top: 20px;">
        <p style="margin: 0;"><strong>${t.questions}</strong></p>
        <p style="margin: 5px 0 0 0;">${t.email}</p>
      </div>

      <div style="text-align: center; padding-top: 20px; margin-top: 30px; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b;">${t.team}</p>
      </div>
    </div>
  </div>
</body>
</html>`;

    // Get Gmail access token and send via Gmail API
    let gmailAccessToken;
    try {
      gmailAccessToken = await base44.asServiceRole.connectors.getAccessToken('gmail');
      await sendEmailViaGmail(gmailAccessToken, registration.user_email, t.subject, emailBody);
    } catch (gmailError) {
      console.error('Failed to send confirmation email:', gmailError.message);
    }

    // Send updated QR code email directly using Gmail API
    try {
      const QRCode = (await import('npm:qrcode@1.5.3')).default;
      
      const participants = registration.participants || [];
      const mainParticipant = participants[0] || {};
      const recipientEmail = registration.customer_email || registration.user_email || mainParticipant.email;
      const recipientName = mainParticipant.name || registration.customer_name || recipientEmail;

      // Generate QR codes for each participant
      const qrCodes = [];
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i];
        
        const qrData = {
          rid: registrationId,
          pid: participant.id_number,
          idx: i,
          days: newSelectedDayNumbers,
          ts: Date.now(),
          hash: btoa(`${registrationId}-${participant.id_number}-${Date.now()}`).slice(0, 12)
        };

        const qrString = JSON.stringify(qrData);
        const encodedQR = btoa(qrString);

        // Generate QR as buffer
        const qrBuffer = await QRCode.toBuffer(encodedQR, {
          errorCorrectionLevel: 'H',
          type: 'png',
          width: 300,
          margin: 2,
          color: { dark: '#1e40af', light: '#ffffff' }
        });

        // Upload QR image to storage
        const blob = new Blob([qrBuffer], { type: 'image/png' });
        const file = new File([blob], `qr-${registrationId}-${i}.png`, { type: 'image/png' });
        
        const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({ file });
        
        qrCodes.push({
          name: participant.name,
          idNumber: participant.id_number,
          qrUrl: uploadResult.file_url
        });
      }

      // Build QR codes HTML
      let qrCodesHtml = '';
      qrCodes.forEach((qr) => {
        qrCodesHtml += `
          <div style="text-align: center; margin: 20px 0; padding: 20px; background: #f8fafc; border-radius: 12px; border: 2px solid #e2e8f0;">
            ${qrCodes.length > 1 ? `<p style="font-weight: bold; margin-bottom: 10px; color: #1e40af;">${language === 'he' ? 'קוד QR עבור' : 'QR Code for'}: ${qr.name}</p>` : ''}
            <img src="${qr.qrUrl}" alt="QR Code" width="250" height="250" style="max-width: 250px; width: 250px; height: 250px; border-radius: 8px; display: block; margin: 0 auto;" />
            <p style="font-size: 12px; color: #64748b; margin-top: 8px;">${qr.idNumber}</p>
          </div>
        `;
      });

      const qrEmailHtml = `
<!DOCTYPE html>
<html dir="${language === 'he' ? 'rtl' : 'ltr'}">
<head><meta charset="UTF-8"></head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background: #f1f5f9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="margin: 0; color: white; font-size: 24px;">🎫 ${language === 'he' ? 'קוד QR מעודכן' : 'Updated QR Code'}</h1>
    </div>
    <div style="background: white; padding: 30px; border-radius: 0 0 16px 16px;">
      <p style="font-size: 18px; color: #1e293b;">${language === 'he' ? `שלום ${recipientName},` : `Hello ${recipientName},`}</p>
      <p style="color: #475569;">${language === 'he' ? 'הנה קוד ה-QR המעודכן שלך לאחר עדכון הימים:' : 'Here is your updated QR code after updating your days:'}</p>
      ${qrCodesHtml}
      <p style="color: #64748b; text-align: center;">${language === 'he' ? 'צוות נפגשים בשביל ישראל' : 'Nifgashim for Israel Team'}</p>
    </div>
  </div>
</body>
</html>`;

      await sendEmailViaGmail(gmailAccessToken, recipientEmail, language === 'he' ? 'קוד QR מעודכן - נפגשים בשביל ישראל' : 'Updated QR Code - Nifgashim for Israel', qrEmailHtml);
    } catch (qrError) {
      console.error('Error sending updated QR email:', qrError);
    }

    return Response.json({
      success: true,
      message: 'Days updated successfully'
    });
  } catch (error) {
    console.error('Error updating days:', error);
    return Response.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
});