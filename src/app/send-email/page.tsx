'use client';

import { useState } from 'react';

const EmailForm: React.FC = () => {
  const cancel = () => {
    // Replace with your navigation logic, e.g., window.location.href or router.push
    console.log("Cancelled and returning to the main page");
    window.location.href = '/';
  };
  const [text, setText] = useState(''); // 同步内容
  const [status, setStatus] = useState(''); // 状态消息

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 构建 HTML 模板
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007BFF; text-align: center;">New Map Update Request</h2>
        <p>${text.replace(/\n/g, '<br>')}</p>
        <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #888;">
          <p>Thank you for using our service!</p>
          <p>&copy; 2025 Wayfinding Web</p>
        </footer>
      </div>
    `;

    try {
      const response = await fetch('/api/files/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'fkcun114514@gmail.com', subject: 'New Map Update Request', text: emailHTML }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        console.error('Error sending email:', errorResult.message);
        setStatus(`Failed to send email: ${errorResult.message}`);
        return;
      }

      const result = await response.json();
      console.log('Email sent successfully:', result.message);
      setStatus('Email sent successfully!');
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('Failed to send email: An unexpected error occurred.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}><b>Request Message for Map Update</b></h1>
      <p>Please specify the details of your map upload.</p>
      <p>for example: The building's name and level.</p>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Your Message"
            required
            style={styles.textarea}
          />
        </label>
        <button type="submit" style={styles.button}>Send email</button>
      </form>
      <div>
        <button onClick={cancel} style={styles.cancel_button}>
            Don't Send and back to main page
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '15px',
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginTop: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    minHeight: '150px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  status: {
    marginTop: '15px',
    textAlign: 'center',
    color: '#007BFF',
  },
  cancel_button: {
    padding: '10px 20px',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '15px',
    backgroundColor: 'red',
    marginLeft: 'auto',
  },
};

export default EmailForm;