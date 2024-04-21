//root/app/pages/manageNewsLetter/customNewsletterReview.js
import React from 'react';
import DOMPurify from 'dompurify';

export default function CustomNewsletterReview({ content }) {

    const sanitizedContent = DOMPurify.sanitize(content);

    return (
        <div className=''> 
            <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>
    );
}