
import React from 'react'
import './style.scss';

export default function TfaPage() {
  return (
    <div className="tfa-page">
      <div className="content">
        <h4 className='text-white text-2xl capitalize'>Two factor setup</h4>
        <p>Take these few steps to enable two-factor authentication and make your account more secure</p>
        <div className="qr-code">
          <div className="qr-code-box">
            
          </div>
        </div>
        <div className="input-code">
          <input type="text" name="text" id="text" placeholder='Authentication Code' autoComplete='off' />
        </div>
        <button type='submit' className='capitalize' >enable</button>
      </div>
    </div>
  )
}
