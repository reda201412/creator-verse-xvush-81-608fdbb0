# Script pour déplacer les composants dans leurs dossiers respectifs
$basePath = "$PSScriptRoot\..\src\components"

# Création des dossiers s'ils n'existent pas
$folders = @("ui", "viewer", "layout", "shared")
foreach ($folder in $folders) {
    $path = Join-Path $basePath $folder
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
    }
}

# Définition des mouvements
$moves = @(
    @{ Source = "ProgressBar.tsx"; Destination = "ui" },
    @{ Source = "TabNav.tsx"; Destination = "ui" },
    @{ Source = "XDoseLogo.tsx"; Destination = "ui" },
    
    @{ Source = "CreatorHeader.tsx"; Destination = "layout" },
    @{ Source = "ProfileNav.tsx"; Destination = "layout" },
    
    @{ Source = "ContentCard.tsx"; Destination = "shared" },
    @{ Source = "ContentGrid.tsx"; Destination = "shared" },
    @{ Source = "ProfileAvatar.tsx"; Destination = "shared" },
    
    @{ Source = "ContentCreatorCard.tsx"; Destination = "viewer" },
    @{ Source = "CreatorBadge.tsx"; Destination = "viewer" },
    @{ Source = "CreatorPulse.tsx"; Destination = "viewer" },
    @{ Source = "RevenueChart.tsx"; Destination = "viewer" },
    @{ Source = "SubscriptionPanel.tsx"; Destination = "viewer" },
    @{ Source = "SubscriptionTier.tsx"; Destination = "viewer" },
    @{ Source = "UpcomingEvent.tsx"; Destination = "viewer" }
)

# Exécution des déplacements
foreach ($move in $moves) {
    $source = Join-Path $basePath $move.Source
    $dest = Join-Path $basePath $move.Destination $move.Source
    
    if (Test-Path $source) {
        Move-Item -Path $source -Destination $dest -Force
        Write-Host "Déplacé: $($move.Source) -> $($move.Destination)/$($move.Source)"
    } else {
        Write-Host "Avertissement: $($move.Source) non trouvé"
    }
}

Write-Host "Réorganisation des composants terminée."
