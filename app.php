<?php
$jsonFile = './address.json';
$sites = json_decode(file_get_contents($jsonFile), true)['sites'];

// Fonction pour rendre le formulaire
function renderForm($siteName = '', $site = ['url' => '', 'address' => '', 'city' => '', 'postalCode' => '']) {
    $action = $siteName ? 'update' : 'create';
    $oldSiteNameInput = $siteName ? "<input type='hidden' name='old-site-name' value='$siteName'>" : '';
    echo "
        <form method='POST' action='app.php'>
            <h2>" . ($siteName ? 'Modifier Site' : 'Ajouter Site') . "</h2>
            <input type='hidden' name='action' value='$action'>
            $oldSiteNameInput
            <label for='site-name'>Nom:</label>
            <input type='text' id='site-name' name='site-name' value='" . htmlspecialchars($siteName) . "'><br>
            <label for='site-url'>URL:</label>
            <input type='text' id='site-url' name='site-url' value='" . htmlspecialchars($site['url']) . "'><br>
            <label for='site-address'>Adresse:</label>
            <input type='text' id='site-address' name='site-address' value='" . htmlspecialchars($site['address']) . "'><br>
            <label for='site-city'>Ville:</label>
            <input type='text' id='site-city' name='site-city' value='" . htmlspecialchars($site['city']) . "'><br>
            <label for='site-postalCode'>Code Postal:</label>
            <input type='text' id='site-postalCode' name='site-postalCode' value='" . htmlspecialchars($site['postalCode']) . "'><br>
            <button type='submit'>" . ($siteName ? 'Modifier' : 'Ajouter') . "</button>
        </form>
    ";
}

// Traitement des requêtes POST pour les actions create, update, et delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        if ($_POST['action'] === 'create' || $_POST['action'] === 'update') {
            $siteName = $_POST['site-name'];
            $siteData = [
                'url' => $_POST['site-url'],
                'address' => $_POST['site-address'],
                'city' => $_POST['site-city'],
                'postalCode' => $_POST['site-postalCode'],
            ];

            if ($_POST['action'] === 'create') {
                $sites[$siteName] = $siteData;
            } else {
                $oldSiteName = $_POST['old-site-name'];
                if ($oldSiteName !== $siteName) {
                    unset($sites[$oldSiteName]);
                }
                $sites[$siteName] = $siteData;
            }
        } elseif ($_POST['action'] === 'delete') {
            $siteName = $_POST['site-name'];
            unset($sites[$siteName]);
        }

        file_put_contents($jsonFile, json_encode(['sites' => $sites], JSON_PRETTY_PRINT));
        header('Location: app.php');
        exit;
    }
}

// Traitement des requêtes GET pour récupérer les détails d'un site spécifique
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get' && isset($_GET['site'])) {
    $siteName = $_GET['site'];
    if (isset($sites[$siteName])) {
        header('Content-Type: application/json');
        echo json_encode($sites[$siteName]);
        exit;
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Site not found']);
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Sites</title>
    <link rel="stylesheet" href="app.css">
</head>
<body>
    <h1>Gestion des Sites</h1>
    <a class="go-back-button" href="/">Retour au générateur</a>
    <div id="site-container">
        <?php foreach ($sites as $siteName => $site): ?>
            <div class="site-card">
                <h3><?= htmlspecialchars($siteName) ?></h3>
                <p><strong>URL:</strong> <a href="<?= htmlspecialchars($site['url']) ?>" target="_blank"><?= htmlspecialchars($site['url']) ?></a></p>
                <p><strong>Adresse:</strong> <?= htmlspecialchars($site['address']) ?></p>
                <p><strong>Ville:</strong> <?= htmlspecialchars($site['city']) ?></p>
                <p><strong>Code Postal:</strong> <?= htmlspecialchars($site['postalCode']) ?></p>
                <form method="POST" action="app.php" style="display: inline; box-shadow: none;" onsubmit="return confirm('Êtes-vous sûr de vouloir supprimer ce site ?');">
                    <input type="hidden" name="action" value="delete">
                    <input type="hidden" name="site-name" value="<?= htmlspecialchars($siteName) ?>">
                    <button type="submit">Supprimer</button>
                </form>
                <button onclick="editSite('<?= htmlspecialchars($siteName) ?>')">Modifier</button>
            </div>
        <?php endforeach; ?>
    </div>
    <button id="add-site-button" onclick="showAddForm()">Ajouter un Site</button>

    <!-- Modal Structure -->
    <div id="site-modal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <div id="site-form"></div>
        </div>
    </div>

    <script>
        function showAddForm() {
            document.getElementById('site-form').innerHTML = `<?php renderForm(); ?>`;
            document.getElementById('site-modal').style.display = 'block';
        }

        function editSite(siteName) {
            fetch('app.php?action=get&site=' + encodeURIComponent(siteName))
                .then(response => response.json())
                .then(data => {
                    document.getElementById('site-form').innerHTML = `
                        <form method='POST' action='app.php'>
                            <h2>Modifier Site</h2>
                            <input type='hidden' name='action' value='update'>
                            <input type='hidden' name='old-site-name' value='${siteName}'>
                            <label for='site-name'>Nom:</label>
                            <input type='text' id='site-name' name='site-name' value='${siteName}'><br>
                            <label for='site-url'>URL:</label>
                            <input type='text' id='site-url' name='site-url' value='${data.url}'><br>
                            <label for='site-address'>Adresse:</label>
                            <input type='text' id='site-address' name='site-address' value='${data.address}'><br>
                            <label for='site-city'>Ville:</label>
                            <input type='text' id='site-city' name='site-city' value='${data.city}'><br>
                            <label for='site-postalCode'>Code Postal:</label>
                            <input type='text' id='site-postalCode' name='site-postalCode' value='${data.postalCode}'><br>
                            <button type='submit'>Modifier</button>
                        </form>
                    `;
                    document.getElementById('site-modal').style.display = 'block';
                })
                .catch(error => console.error('Error:', error));
        }

        function closeModal() {
            document.getElementById('site-modal').style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == document.getElementById('site-modal')) {
                document.getElementById('site-modal').style.display = 'none';
            }
        }
    </script>
</body>
</html>
