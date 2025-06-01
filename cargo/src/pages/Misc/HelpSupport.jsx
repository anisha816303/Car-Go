import React from 'react';
import './HelpSupport.css'; 

function HelpSupport() {
  return (
    <div className="page-content" style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 18 }}>Help & Support</h2>
      <section style={{ marginBottom: 32 }}>
        <h3>Frequently Asked Questions</h3>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            <strong>How do I offer a ride?</strong>
            <br />
            Go to the &quot;Offer Ride&quot; page, fill in your route details, and submit your ride.
          </li>
          <li style={{ marginTop: 10 }}>
            <strong>How do I find a ride?</strong>
            <br />
            Use the &quot;Find Ride&quot; page to search for available rides between your source and destination.
          </li>
          <li style={{ marginTop: 10 }}>
            <strong>How can I update or delete my ride?</strong>
            <br />
            Visit &quot;My Rides&quot; to see your rides and use the update or delete options for your current ride.
          </li>
          <li style={{ marginTop: 10 }}>
            <strong>Is my personal information safe?</strong>
            <br />
            Yes, your data is securely stored and only shared with matched riders/drivers.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Contact Support</h3>
        <div style={{ marginTop: 10, fontSize: 16 }}>
          <div>
            <strong>Email:</strong>{' '}
            <a href="mailto:anisha.ajit303@gmail.com">anisha.ajit303@gmail.com</a>
          </div>
          <div style={{ marginTop: 6 }}>
            <strong>Phone:</strong>{' '}
            <a href="tel:8105832218">8105832218</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HelpSupport;