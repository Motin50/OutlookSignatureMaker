const MotinColor = '#C41230';
const PerrardColor = '#FF6A08';
let sites = {};
let sitesValue = 'Nos sites : Saint-Gilles (50), Vire (14), Isigny Le Buat (50), Valognes (50)';

document.addEventListener('DOMContentLoaded', () => {
    fetchAddresses();
    generateSignature();
});

async function fetchAddresses() {
    try {
        const response = await fetch('address.json');
        const data = await response.json();
        populateSiteOptions(data.sites);
        populateSiteDetails(data.sites);
        sites = data.sites;
    } catch (error) {
        console.error('Error fetching address data:', error);
    }
}

function populateSiteOptions(sites) {
    const siteSelect = document.getElementById('site');
    siteSelect.innerHTML = ''; // Clear existing options
    for (const site in sites) {
        const option = document.createElement('option');
        option.value = site;
        option.textContent = site;
        siteSelect.appendChild(option);
        // Set default site
        if (site === 'Motin Saint-Gilles') {
            siteSelect.value = site;
            generateSignature();
        }
    }
}

function populateSiteDetails(sites) {
    document.getElementById('site').addEventListener('input', () => {
        generateSignature();
    });
}

document.getElementById('custom-logo').addEventListener('change', handleLogoUpload);

document.getElementById('logo').addEventListener('input', () => {
    document.getElementById('custom-logo-data').value = '';
    generateSignature();
});

document.getElementById('logo').addEventListener('change', () => {
    if (document.getElementById('logo').value === 'https://motin.fr/logo-signature/logo_perrard.png') {
        console.log('Perrard logo selected');
        document.getElementById('site').value = 'ETS Perrard';
        for (let i = 0; i < document.getElementById('site').length; i++) {
            if (document.getElementById('site').options[i].value !== 'ETS Perrard') {
                document.getElementById('site').options[i].disabled = true;
            }
        }
        document.getElementById('separator-color').value = PerrardColor;
        document.getElementById('link-color').value = PerrardColor;
        document.getElementById('text-color').value = '#000000';
        document.getElementById('facebook').value = 'https://www.facebook.com/PerrardMontbray/?locale=fr_FR';
        // désélectionner les réseaux sociaux
        document.getElementById('instagram-checkbox').checked = false;
        document.getElementById('linkedin-checkbox').checked = false;
        document.getElementById('tiktok-checkbox').checked = false;

        sitesValue = '';
        generateSignature();
    } else {
        console.log('Non-Perrard logo selected');
        document.getElementById('site').value = 'Motin Saint-Gilles';
        // rendre les autres options du select sélectionnables
        for (let i = 0; i < document.getElementById('site').length; i++) {
            document.getElementById('site').options[i].disabled = false;
        }
        document.getElementById('separator-color').value = MotinColor;
        document.getElementById('link-color').value = MotinColor;
        document.getElementById('text-color').value = '#000000';
        document.getElementById('facebook').value = 'https://www.facebook.com/motinnormagri';
        sitesValue = 'Nos sites : Saint-Gilles (50), Vire (14), Isigny Le Buat (50), Valognes (50)';
        document.getElementById('instagram-checkbox').checked = true;
        document.getElementById('linkedin-checkbox').checked = true;
        document.getElementById('tiktok-checkbox').checked = true;
        resetColors(event);
        generateSignature();
    }
});

document.getElementById('first-name').addEventListener('input', generateSignature);
document.getElementById('last-name').addEventListener('input', generateSignature);
document.getElementById('title').addEventListener('input', generateSignature);
document.getElementById('email').addEventListener('input', generateSignature);
document.getElementById('phone').addEventListener('input', generateSignature);
document.getElementById('phone2').addEventListener('input', generateSignature);
document.getElementById('site').addEventListener('input', generateSignature);
document.getElementById('address').addEventListener('input', generateSignature);
document.getElementById('zip').addEventListener('input', generateSignature);
document.getElementById('city').addEventListener('input', generateSignature);
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

function resetColors(event) {
    event.preventDefault();
    if (document.getElementById('logo').value !== 'https://motin.fr/logo-signature/logo_perrard.png') {
        document.getElementById('separator-color').value = MotinColor;
        document.getElementById('link-color').value = MotinColor;
        document.getElementById('text-color').value = '#000000';
        console.log(document.getElementById('site').value);
        generateSignature(sites[document.getElementById('site').value]);
    } else {
        document.getElementById('separator-color').value = PerrardColor;
        document.getElementById('link-color').value = PerrardColor;
        document.getElementById('text-color').value = '#000000';
        generateSignature(sites[document.getElementById('site').value]);
    }
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

async function generateSignature() {
    const selectedSite = document.getElementById('site').value;
    const siteDetails = sites[selectedSite];
    const selectLogo = document.getElementById('logo').value;
    const customLogo = document.getElementById('custom-logo-data').value;
    const logo = customLogo || selectLogo;
    const custom_address = document.getElementById('address').value;
    const custom_postalCode = document.getElementById('zip').value;
    const custom_city = document.getElementById('city').value;
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const title = document.getElementById('title').value;
    const email = document.getElementById('email').value;
    let phone = document.getElementById('phone').value;
    phone = phone.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
    let phone2 = document.getElementById('phone2').value;
    phone2 = phone2.replace(/\B(?=(\d{2})+(?!\d))/g, ' ');
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

    let facebookHTML = '';
    if (facebookCheck) {
        facebookHTML = `<a href="${facebook}"><img src="https://motin.fr/logo-signature/facebook_logo.png" alt="Facebook" width="20" height="20" style="margin-right: 5px;"></a>`;
    }

    const signatureHTML = `
        <table style="border-collapse: collapse; font-family: Arial, sans-serif; width: 600px; color: ${textColor};">
            <tr>
                <td style="padding: 10px; width: 125px;"><img src="${logo}" alt="Logo" style="width: 100px; height: auto;"></td>
                <td style="border-left: 4px solid ${separatorColor}; width: 15px;"></td>
                <td style="padding-left: 20px;">
                    <div style="font-size: 20px; font-weight: bold;">${firstName} ${lastName}</div>
                    <div style="font-size: 14px; font-style: italic;">${title}</div>
                    <table style="font-size: 12px; margin-top: 4px; width: 100%;">
                        <tr>
                            <td style="width: 40%;">
                                <a href="mailto:${email}" style="color: ${linkColor}; text-decoration: none;">${email}</a><br>
                                ${phone ? `<a href="tel:+33${phone}" style="color: ${linkColor}; text-decoration: none;">+33 ${phone}</a><br>` : ''}
                                ${phone2 ? `<a href="tel:+33${phone2}" style="color: ${linkColor}; text-decoration: none;"> ${phone2}</a><br>` : ''}
                                <a href="${siteDetails ? siteDetails.url : ''}" style="color: ${linkColor}; text-decoration: none;">${siteDetails ? siteDetails.url : ''}</a>
                            </td>
                            <td style="width: ${selectLogo === 'https://motin.fr/logo-signature/logo_perrard.png' ? '33%' : '50%'};">
                                <div style="font-weight: bold;">Adresse</div>
                                <div>${custom_address ? custom_address : (siteDetails ? siteDetails.address : '')}</div>
                                <div>${custom_postalCode ? custom_postalCode : (siteDetails ? siteDetails.postalCode : '')} ${custom_city ? custom_city : (siteDetails ? siteDetails.city : '')}</div>
                                <div>France</div>
                            </td>
                            ${selectLogo === 'https://motin.fr/logo-signature/logo_perrard.png' ? `
                                <td style="vertical-align: center; width: 33%;">
                                    ${facebookHTML}
                                </td>` : ''}
                        </tr>
                    </table>
                    ${selectLogo !== 'https://motin.fr/logo-signature/logo_perrard.png' ? `
                        <div style="margin-top: 4px;">
                            ${facebookHTML}
                            ${instagramCheck ? `<a href="${instagram}"><img src="https://motin.fr/logo-signature/instagram_logo.png" alt="Instagram" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                            ${linkedinCheck ? `<a href="${linkedin}"><img src="https://motin.fr/logo-signature/linkedin_logo.png" width="20" height="20" alt="LinkedIn" style="margin-right: 5px;"></a>` : ''}
                            ${tiktokCheck ? `<a href="${tiktok}"><img src="https://motin.fr/logo-signature/tiktok_logo.png" alt="TikTok" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                        </div>` : `
                        <div style="margin-top: 4px;">
                            ${instagramCheck ? `<a href="${instagram}"><img src="https://motin.fr/logo-signature/instagram_logo.png" alt="Instagram" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                            ${linkedinCheck ? `<a href="${linkedin}"><img src="https://motin.fr/logo-signature/linkedin_logo.png" width="20" height="20" alt="LinkedIn" style="margin-right: 5px;"></a>` : ''}
                            ${tiktokCheck ? `<a href="${tiktok}"><img src="https://motin.fr/logo-signature/tiktok_logo.png" alt="TikTok" width="20" height="20" style="margin-right: 5px;"></a>` : ''}
                        </div>`}
                </td>
            </tr>
        </table>
        <div id="sites-list" style="font-size: 13px; margin-top: 10px; color: #666; font-weight: bold;">
            ${sitesValue}
        </div>
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
