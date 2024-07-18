document.addEventListener('DOMContentLoaded', () => {
    generateSignature();
});

document.getElementById('custom-logo').addEventListener('change', handleLogoUpload);

document.getElementById('logo').addEventListener('input', () => {
    // Clear custom logo data when a preset logo is selected
    document.getElementById('custom-logo-data').value = '';
    generateSignature();
});
document.getElementById('first-name').addEventListener('input', generateSignature);
document.getElementById('last-name').addEventListener('input', generateSignature);
document.getElementById('title').addEventListener('input', generateSignature);
document.getElementById('email').addEventListener('input', generateSignature);
document.getElementById('phone').addEventListener('input', generateSignature);
document.getElementById('site').addEventListener('input', generateSignature);
document.getElementById('facebook-checkbox').addEventListener('input', generateSignature);
document.getElementById('instagram-checkbox').addEventListener('input', generateSignature);
document.getElementById('linkedin-checkbox').addEventListener('input', generateSignature);
document.getElementById('tiktok-checkbox').addEventListener('input', generateSignature);
document.getElementById('facebook').addEventListener('input', generateSignature);
document.getElementById('instagram').addEventListener('input', generateSignature);
document.getElementById('linkedin').addEventListener('input', generateSignature);
document.getElementById('tiktok').addEventListener('input', generateSignature);
document.getElementById('separator-color').addEventListener('input', generateSignature);
document.getElementById('link-color').addEventListener('input', generateSignature);
document.getElementById('text-color').addEventListener('input', generateSignature);

function resetColors() {
    document.getElementById('separator-color').value = '#C41230';
    document.getElementById('link-color').value = '#C41230';
    document.getElementById('text-color').value = '#000000';
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 200, 200);
                document.getElementById('custom-logo-data').value = canvas.toDataURL('image/png');
                generateSignature();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function generateSignature() {
    const selectLogo = document.getElementById('logo').value;
    const customLogo = document.getElementById('custom-logo-data').value;
    const logo = customLogo || selectLogo;

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    phone = phone.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
    const site = document.getElementById('site').value;
    const facebookCheck = document.getElementById('facebook-checkbox').checked;
    const instagramCheck = document.getElementById('instagram-checkbox').checked;
    const linkedinCheck = document.getElementById('linkedin-checkbox').checked;
    const tiktokCheck = document.getElementById('tiktok-checkbox').checked;
    const facebook = document.getElementById('facebook').value || 'https://www.facebook.com/motinnormagri';
    const instagram = document.getElementById('instagram').value || 'https://www.instagram.com/motin_normagri/';
    const linkedin = document.getElementById('linkedin').value || 'https://www.linkedin.com/company/motin-normagri';
    const tiktok = document.getElementById('tiktok').value || 'https://www.tiktok.com/@motin_sas';
    const separatorColor = document.getElementById('separator-color').value;
    const linkColor = document.getElementById('link-color').value;
    const textColor = document.getElementById('text-color').value;

    const siteDetails = {
        'Motin Saint-Gilles': { url: 'https://www.motin.fr', address: 'Route de Saint-Lô', city: 'Saint-Gilles', postalCode: '50180' },
        'Motin Vire': { url: 'https://www.motin.fr', address: 'ZA La Papillonnière', city: 'Vire', postalCode: '14500' },
        'Motin Isigny le Buat': { url: 'https://www.motin.fr', address: '23 Route du Mont Saint Michel', city: 'Isigny le Buat', postalCode: '50540' },
        'AMS Valognes': { url: 'https://www.motin.fr', address: 'ZA D\'Armanville', city: 'Valognes', postalCode: '50700' },
        'ETS Perrard': { url: 'https://www.ets-perrard.fr', address: 'Le Bourg Neuf', city: 'Montbray', postalCode: '50410' },
    };

    const signatureHTML = `
        <table style="border-collapse: collapse; font-family: Arial, sans-serif; width: 700px; color: ${textColor};">
            <tr>
                <td style="padding: 10px; width: 125px;"><img src="${logo}" alt="Logo" style="width: 100px; height: auto;"></td>
                <td style="border-left: 4px solid ${separatorColor}; width: 15px;"></td>
                <td style="padding-left: 20px;">
                    <div style="font-size: 20px; font-weight: bold;">${firstName} ${lastName}</div>
                    <div style="font-size: 14px; font-style: italic;">${title}</div>
                    <table style="font-size: 12px; margin-top: 4px; width: 70%;">
                        <tr style="margin-right: 10px;">
                            <td>
                                <a href="mailto:${email}" style="color: ${linkColor}; text-decoration: none;">${email}</a><br>
                                <a href="tel:+33${phone}" style="color: ${linkColor}; text-decoration: none;">+33 ${phone}</a><br>
                                <a href="${siteDetails[site].url}" style="color: ${linkColor}; text-decoration: none;">${siteDetails[site].url}</a>
                            </td>
                            <td>
                                <div style="font-weight: bold;">Adresse</div>
                                <div>${siteDetails[site].address}</div>
                                <div>${siteDetails[site].postalCode} ${siteDetails[site].city}</div>
                            </td>
                        </tr>
                    </table>
                    <div style="margin-top: 4px;">
                        ${facebookCheck ? `<a href="${facebook}"><img src="https://motin.fr/logo-signature/facebook_20.png" alt="Facebook" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                        ${instagramCheck ? `<a href="${instagram}"><img src="https://motin.fr/logo-signature/instagram_20.png" alt="Instagram" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                        ${linkedinCheck ? `<a href="${linkedin}"><img src="https://motin.fr/logo-signature/linkedin_20.png" width="20" height="20" alt="LinkedIn" style="margin-right: 5px;"></a>` : ''}
                        ${tiktokCheck ? `<a href="${tiktok}"><img src="https://motin.fr/logo-signature/tiktok_20.png" alt="TikTok" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                    </div>
                </td>
            </tr>
        </table>
    `;

    document.getElementById('signature-preview').innerHTML = signatureHTML;
}

function copySignature() {
    const signaturePreview = document.getElementById('signature-preview');
    const range = document.createRange();
    range.selectNode(signaturePreview);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    alert('Signature copiée dans le presse-papiers!');
}