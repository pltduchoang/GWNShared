//root/frontend/app/pages/manageNewsLetter/newsLetterTemplateOne.js
import React from 'react';
import DOMPurify from 'dompurify';

export default function NewsLetterTemplateOne({ header, imageURL, mainParagraph, bannerText, bannerButtonText, bannerButtonLink, instagramLink, facebookLink, xLink, unsubscribeLink }) {
  
    // Sanitize the content
    const sanitizedHeader = DOMPurify.sanitize(header);
    const sanitizedMainParagraph = DOMPurify.sanitize(mainParagraph);
    


    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '600px',
        margin: 'auto',
        backgroundColor: '#f6f4dd',
      }}>
        <div style={{
            width: '100%',
            display: 'flex',
            backgroundColor: '#96af4e',
            padding: '10px 0',
        }}>
            <div style={
                {
                    width: '45%',
                    display: 'flex',
                    justifyContent: 'right',
                }
            }>
                <a href="/">
                    <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/logo.png?alt=media&token=694cce0f-84a8-4b24-9176-91310a0ecf59" alt="Company logo"
                    style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '250px',
                        padding: '0 20px',
                    }}/>
                </a>
            </div>
            <div style={{
                width: '55%',
                display: 'flex',
                justifyContent: 'left',
                alignItems: 'center',
                alignItems: 'center',
                fontSize: '1.5em',
                paddingTop: '10px',
                paddingRight: '30px',
            }}>
                <div dangerouslySetInnerHTML={{ __html: sanitizedHeader }}></div>
            </div>
        </div>
  
            
        <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        }}>
            <img src={imageURL} alt="Main image" style={{
                width: '100%',
                height: 'auto',
                maxWidth: '600px',
                objectFit: 'cover',
            }}/>
        </div>
  

        <div dangerouslySetInnerHTML={{ __html: sanitizedMainParagraph }}
        style={{
            padding: '40px 60px',
            minHeight: '200px',
        }}></div>
  

        <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#96af4e',
            padding: '20px 0',
            minHeight: '100px',
        }}>
            <div style={{
                width: '50%',
                padding: '0 60px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '1.2em',
                color: '#f6f4dd',
            }}>
                <p>{bannerText}</p>
            </div>
            <div style={{
                width:'50%',
            }}>
                <a href={bannerButtonLink}
                style={{
                    backgroundColor: '#333941',
                    color: '#f6f4dd',
                    padding: '5px 10px',
                    textDecoration: 'none', // changed from 'bold' which is invalid here to 'none'
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'inline-block',
                    minHeight: '45px',
                    maxWidth: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>{bannerButtonText}</a>
            </div>
        </div>
  

        <div style={{
            width: '100%',
            backgroundColor: '#333941',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 0 0 0',
        }}>
          <a href={instagramLink}>
            <div>
                <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/instagram-svgrepo-com.png?alt=media&token=03597001-337d-4770-8a1d-fcaed92b1a6a" alt="Instagram link"
                style={{
                    maxWidth: '65px',
                    margin: '0 10px',
                }}/>
            </div>
          </a>
          <a href={facebookLink} >
            <div>
                <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/facebook-color-svgrepo-com.png?alt=media&token=1a3728a5-dace-4870-bfda-4b5095732149" alt="Facebook link"
                style={{
                    maxWidth: '53px',
                    margin: '0 10px',
                }}/>
            </div>
          </a>
          <a href={xLink}>
            <div>
                <img src="https://firebasestorage.googleapis.com/v0/b/gwncapstone.appspot.com/o/twitter-svgrepo-com.png?alt=media&token=bb9f5138-7d4e-409b-a4f7-95e0d678e0b7" alt="X link"
                style={{
                    maxWidth: '63px',
                    margin: '0 10px',
                }}/>
            </div>
          </a>
        </div>
  

        <footer style={{
            backgroundColor: '#333941',
            color: '#f6f4dd',
            padding: '20px 0',
            display: 'flex',
            justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <p>Grow Within Nutrition, all rights reserved.</p>
            <a href="#"
            style={{
                display: 'block',
                textDecoration: 'none',
                padding: '10px 0',
            }}>Unsubscribe</a>
          </div>
        </footer>
      </div>
    );
  }
  