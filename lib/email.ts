// メール送信機能（実装例）
// 本番環境では、SendGrid、AWS SES、Resendなどのサービスを使用してください

export async function sendReservationConfirmation(
  to: string,
  reservationDetails: {
    serviceName: string;
    date: string;
    time: string;
    amount: number;
  }
) {
  // 開発環境ではコンソールに出力
  console.log('予約確認メール送信:', {
    to,
    subject: '【予約確認】ご予約ありがとうございます',
    reservationDetails,
  });

  // TODO: 本番環境では実際のメール送信を実装
  // 例: SendGrid, AWS SES, Resend など
  /*
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
        subject: '【予約確認】ご予約ありがとうございます',
      }],
      from: { email: process.env.EMAIL_FROM },
      content: [{
        type: 'text/html',
        value: emailTemplate,
      }],
    }),
  });
  */

  return Promise.resolve();
}

export async function sendReservationReminder(
  to: string,
  reservationDetails: {
    serviceName: string;
    date: string;
    time: string;
  }
) {
  console.log('リマインドメール送信:', {
    to,
    subject: '【リマインド】明日のご予約について',
    reservationDetails,
  });

  // TODO: 本番環境では実際のメール送信を実装
  return Promise.resolve();
}
