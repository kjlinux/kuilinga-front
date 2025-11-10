import { Step } from 'react-joyride';

export interface TourSteps {
  dashboard: Step[];
  attendance: Step[];
  reports: Step[];
  employees: Step[];
  leaves: Step[];
  devices: Step[];
  organization: Step[];
  admin: Step[];
  settings: Step[];
  onboarding: Step[];
}

export const tourSteps: TourSteps = {
  // Tour 1: Dashboard Overview (6 étapes)
  dashboard: [
    {
      target: 'body',
      content: 'Bienvenue sur KUILINGA ! Laissez-nous vous faire découvrir les fonctionnalités principales de votre système de gestion des présences. Vous pouvez quitter cette visite à tout moment.',
      placement: 'center',
      disableBeacon: true,
      title: 'Bienvenue sur KUILINGA',
    },
    {
      target: '[data-tour="dashboard-cards"]',
      content: 'Voici votre tableau de bord personnalisé. Il affiche les statistiques et métriques importantes selon votre rôle dans l\'organisation.',
      placement: 'bottom',
      title: 'Tableau de bord',
    },
    {
      target: '[data-tour="dashboard-kpis"]',
      content: 'Ces indicateurs clés (KPIs) vous donnent un aperçu rapide : présents aujourd\'hui, absents, retards, taux de présence, heures travaillées et congés en attente.',
      placement: 'bottom',
      title: 'Indicateurs clés',
    },
    {
      target: '[data-tour="dashboard-charts"]',
      content: 'Les graphiques interactifs vous permettent de visualiser l\'évolution des présences sur 30 jours et la distribution présents/absents/retards.',
      placement: 'top',
      title: 'Graphiques interactifs',
    },
    {
      target: '[data-tour="dashboard-realtime"]',
      content: 'Cette section affiche les pointages en temps réel de vos employés avec l\'heure, le type (entrée/sortie) et le dispositif utilisé.',
      placement: 'top',
      title: 'Pointages temps réel',
    },
    {
      target: '[data-tour="sidebar-navigation"]',
      content: 'Utilisez ce menu pour naviguer entre les différentes sections : présences, employés, rapports, et plus encore. Les options disponibles dépendent de vos permissions.',
      placement: 'right',
      title: 'Navigation',
    },
  ],

  // Tour 2: Attendance Tracking (5 étapes)
  attendance: [
    {
      target: '[data-tour="attendance-list"]',
      content: 'Voici la liste de toutes les présences enregistrées en temps réel. Vous pouvez voir les pointages d\'entrée et de sortie de vos employés avec les informations de dispositif et géolocalisation.',
      placement: 'top',
      title: 'Liste des présences',
    },
    {
      target: '[data-tour="attendance-realtime-indicator"]',
      content: 'L\'indicateur "Connecté au serveur temps réel" confirme que vous recevez automatiquement les nouveaux pointages. Vous entendrez une notification sonore à chaque nouveau pointage.',
      placement: 'bottom',
      title: 'Notifications temps réel',
    },
    {
      target: '[data-tour="attendance-filters"]',
      content: 'Utilisez ce champ de recherche pour filtrer rapidement les présences par nom d\'employé, type de pointage, ou dispositif.',
      placement: 'bottom',
      title: 'Recherche de présences',
    },
    {
      target: '[data-tour="attendance-actions"]',
      content: 'Actualisez la liste pour voir les dernières présences, ou exportez les données pour vos rapports et analyses.',
      placement: 'left',
      title: 'Actions disponibles',
    },
    {
      target: '[data-tour="attendance-list"]',
      content: 'Chaque ligne affiche : l\'employé, la date/heure du pointage, le type (entrée/sortie), le dispositif utilisé et la géolocalisation si disponible. Les nouveaux pointages apparaissent automatiquement en haut de la liste.',
      placement: 'top',
      title: 'Détails des pointages',
    },
  ],

  // Tour 3: Reports (5 étapes)
  reports: [
    {
      target: '[data-tour="report-selection"]',
      content: 'Choisissez parmi une variété de rapports prédéfinis adaptés à votre rôle : présences, absences, heures travaillées, et plus encore.',
      placement: 'right',
      title: 'Sélection de rapport',
    },
    {
      target: '[data-tour="report-roles"]',
      content: 'Les rapports disponibles dépendent de votre rôle : Super Admin (R1-R4), Admin/RH (R5-R11), Manager (R12-R16), Employé (R17-R20). Chaque rapport est conçu pour répondre à vos besoins spécifiques.',
      placement: 'bottom',
      title: 'Rapports par rôle',
    },
    {
      target: '[data-tour="report-filters"]',
      content: 'Configurez les filtres de votre rapport : période, organisation, site, département, ou employé spécifique. Les filtres varient selon le type de rapport sélectionné.',
      placement: 'top',
      title: 'Configuration des filtres',
    },
    {
      target: '[data-tour="report-generate"]',
      content: 'Cliquez sur "Générer la prévisualisation" pour voir un aperçu des données du rapport avant de le télécharger.',
      placement: 'bottom',
      title: 'Génération de prévisualisation',
    },
    {
      target: '[data-tour="report-preview"]',
      content: 'Prévisualisez votre rapport et téléchargez-le au format PDF pour l\'impression, Excel pour l\'analyse, ou CSV pour l\'import dans d\'autres systèmes.',
      placement: 'left',
      title: 'Aperçu et téléchargement',
    },
  ],

  // Tour 4: Employee Management (5 étapes)
  employees: [
    {
      target: '[data-tour="employee-list"]',
      content: 'Gérez tous vos employés depuis cette interface. Vous pouvez voir leurs informations, horaires, et historique de présence.',
      placement: 'top',
      title: 'Gestion des employés',
    },
    {
      target: '[data-tour="employee-import"]',
      content: 'Importez plusieurs employés en une fois via un fichier CSV. Idéal pour ajouter rapidement une équipe complète ou migrer des données existantes.',
      placement: 'bottom',
      title: 'Import d\'employés',
    },
    {
      target: '[data-tour="add-employee"]',
      content: 'Cliquez ici pour ajouter un nouvel employé manuellement. Renseignez ses informations personnelles, son poste, son affectation (site/département), et son numéro de badge.',
      placement: 'bottom',
      title: 'Ajouter un employé',
    },
    {
      target: '[data-tour="employee-search"]',
      content: 'Utilisez la recherche et les filtres pour trouver rapidement un employé dans votre liste par nom, email, département ou site.',
      placement: 'bottom',
      title: 'Recherche d\'employé',
    },
    {
      target: '[data-tour="employee-details"]',
      content: 'Chaque ligne affiche les informations clés : numéro d\'employé, nom, prénom, email, téléphone, poste, département, site, numéro de badge et statut (actif/inactif). Cliquez sur une ligne pour modifier ou supprimer un employé.',
      placement: 'top',
      title: 'Détails des employés',
    },
  ],

  // Tour 5: Leaves Management (5 étapes)
  leaves: [
    {
      target: 'body',
      content: 'Bienvenue dans le module de gestion des congés. Gérez les demandes de congés de vos employés : création, approbation, suivi des soldes.',
      placement: 'center',
      disableBeacon: true,
      title: 'Gestion des congés',
    },
    {
      target: '[data-tour="leaves-list"]',
      content: 'Visualisez toutes les demandes de congés avec leurs détails : employé, type de congé (payé, maladie, sans solde...), dates, durée, raison, statut et approbateur.',
      placement: 'top',
      title: 'Liste des demandes',
    },
    {
      target: '[data-tour="add-leave"]',
      content: 'Créez une nouvelle demande de congé pour un employé. Sélectionnez le type, les dates de début et fin, et ajoutez une raison.',
      placement: 'bottom',
      title: 'Nouvelle demande',
    },
    {
      target: '[data-tour="leaves-search"]',
      content: 'Filtrez les demandes par employé, type de congé, statut (en attente, approuvé, rejeté, annulé) ou période.',
      placement: 'bottom',
      title: 'Recherche et filtres',
    },
    {
      target: '[data-tour="leaves-status"]',
      content: 'Les demandes de congés passent par un workflow d\'approbation : "En attente" → "Approuvé" ou "Rejeté" par un RH ou Manager. Les employés peuvent "Annuler" leurs demandes.',
      placement: 'top',
      title: 'Workflow d\'approbation',
    },
  ],

  // Tour 6: Devices Management (5 étapes)
  devices: [
    {
      target: 'body',
      content: 'Bienvenue dans le module de gestion des dispositifs biométriques (pointeuses). Gérez vos terminaux, surveillez leur statut et suivez les pointages.',
      placement: 'center',
      disableBeacon: true,
      title: 'Gestion des dispositifs',
    },
    {
      target: '[data-tour="devices-list"]',
      content: 'Visualisez tous vos terminaux de pointage avec leurs informations : numéro de série, type, statut, organisation, site, dernier pointage et nombre de pointages du jour.',
      placement: 'top',
      title: 'Liste des dispositifs',
    },
    {
      target: '[data-tour="add-device"]',
      content: 'Enregistrez un nouveau terminal en renseignant son numéro de série, type (biométrique, badge, QR code...), et son affectation à une organisation et un site.',
      placement: 'bottom',
      title: 'Ajouter un terminal',
    },
    {
      target: '[data-tour="devices-status"]',
      content: 'Surveillez le statut de chaque dispositif : "En ligne" (opérationnel), "Hors ligne" (déconnecté), "Maintenance" (en réparation). Le statut se met à jour automatiquement.',
      placement: 'top',
      title: 'Statut des terminaux',
    },
    {
      target: '[data-tour="devices-search"]',
      content: 'Filtrez les dispositifs par numéro de série, type, statut, organisation ou site pour trouver rapidement un terminal spécifique.',
      placement: 'bottom',
      title: 'Recherche de dispositifs',
    },
  ],

  // Tour 7: Organization Structure (6 étapes)
  organization: [
    {
      target: 'body',
      content: 'Bienvenue dans la gestion de la structure organisationnelle. KUILINGA utilise une hiérarchie à 3 niveaux : Organisation → Site → Département.',
      placement: 'center',
      disableBeacon: true,
      title: 'Structure organisationnelle',
    },
    {
      target: '[data-tour="org-hierarchy"]',
      content: 'Niveau 1 : Les Organisations représentent vos entreprises ou entités principales. Chaque organisation peut avoir plusieurs sites et un plan d\'abonnement (Basic, Pro, Enterprise).',
      placement: 'top',
      title: 'Organisations',
    },
    {
      target: '[data-tour="org-sites"]',
      content: 'Niveau 2 : Les Sites sont les localisations physiques de votre organisation (bureaux, usines, succursales...). Chaque site a une adresse, un fuseau horaire et peut contenir plusieurs départements.',
      placement: 'top',
      title: 'Sites',
    },
    {
      target: '[data-tour="org-departments"]',
      content: 'Niveau 3 : Les Départements sont les divisions fonctionnelles au sein d\'un site (RH, IT, Production, Ventes...). Les employés sont affectés à un département spécifique.',
      placement: 'top',
      title: 'Départements',
    },
    {
      target: '[data-tour="org-add"]',
      content: 'Créez votre structure en commençant par l\'organisation, puis ajoutez des sites, et enfin des départements. Assignez ensuite vos employés et dispositifs à la bonne localisation.',
      placement: 'bottom',
      title: 'Construire votre structure',
    },
    {
      target: '[data-tour="sidebar-navigation"]',
      content: 'Naviguez entre Organisations, Sites et Départements via le menu latéral pour gérer chaque niveau de votre hiérarchie.',
      placement: 'right',
      title: 'Navigation hiérarchique',
    },
  ],

  // Tour 8: Users & Access Management (5 étapes)
  admin: [
    {
      target: 'body',
      content: 'Bienvenue dans la gestion des utilisateurs et des accès. Gérez les comptes utilisateurs, les rôles et les permissions pour contrôler l\'accès au système.',
      placement: 'center',
      disableBeacon: true,
      title: 'Utilisateurs & Accès',
    },
    {
      target: '[data-tour="users-list"]',
      content: 'Gérez les comptes utilisateurs qui peuvent se connecter au système. Chaque utilisateur a un rôle qui détermine ses permissions.',
      placement: 'top',
      title: 'Gestion des utilisateurs',
    },
    {
      target: '[data-tour="roles-system"]',
      content: 'Les rôles définissent les niveaux d\'accès : Super Admin (accès total), Admin Organisation, RH, Manager, Employé. Chaque rôle a des permissions spécifiques.',
      placement: 'top',
      title: 'Système de rôles',
    },
    {
      target: '[data-tour="permissions-list"]',
      content: 'Les permissions contrôlent précisément ce que chaque rôle peut faire : créer, lire, modifier, supprimer des ressources (employés, sites, rapports...).',
      placement: 'top',
      title: 'Permissions granulaires',
    },
    {
      target: '[data-tour="admin-add"]',
      content: 'Créez des utilisateurs en leur attribuant un rôle adapté à leurs responsabilités. Les permissions associées au rôle seront automatiquement appliquées.',
      placement: 'bottom',
      title: 'Créer un utilisateur',
    },
  ],

  // Tour 9: Settings (4 étapes)
  settings: [
    {
      target: '[data-tour="settings-tabs"]',
      content: 'La page Paramètres vous permet de personnaliser votre expérience KUILINGA. Explorez les différents onglets pour gérer votre profil, notifications, sécurité et préférences.',
      placement: 'right',
      title: 'Paramètres du compte',
    },
    {
      target: '[data-tour="settings-profile"]',
      content: 'Gérez les informations de votre profil : nom complet, email, photo de profil. Assurez-vous que vos informations sont à jour.',
      placement: 'top',
      title: 'Profil utilisateur',
    },
    {
      target: '[data-tour="settings-notifications"]',
      content: 'Configurez vos préférences de notifications : emails, push, alertes de retard, rapports hebdomadaires. Choisissez comment vous souhaitez être informé.',
      placement: 'top',
      title: 'Notifications',
    },
    {
      target: '[data-tour="settings-security"]',
      content: 'Sécurisez votre compte : changez votre mot de passe régulièrement. Utilisez un mot de passe fort avec au moins 8 caractères.',
      placement: 'top',
      title: 'Sécurité',
    },
  ],

  // Tour 10: Onboarding (6 étapes)
  onboarding: [
    {
      target: 'body',
      content: 'Bienvenue sur KUILINGA ! Votre plateforme de gestion des présences. Cette visite guidée vous présente les fonctionnalités essentielles pour bien démarrer.',
      placement: 'center',
      disableBeacon: true,
      title: 'Bienvenue sur KUILINGA !',
    },
    {
      target: '[data-tour="dashboard-cards"]',
      content: 'Votre tableau de bord centralise toutes les informations importantes : présences, absents, retards, taux de présence. Les données s\'adaptent à votre rôle.',
      placement: 'bottom',
      title: 'Tableau de bord',
    },
    {
      target: '[data-tour="sidebar-navigation"]',
      content: 'Le menu de navigation vous donne accès à toutes les fonctionnalités : Présences, Rapports, Employés, Congés, Dispositifs, et plus encore. Les options varient selon vos permissions.',
      placement: 'right',
      title: 'Menu de navigation',
    },
    {
      target: 'body',
      content: 'Les fonctionnalités clés : 📊 Tableaux de bord personnalisés, 👥 Gestion des employés, ⏰ Suivi temps réel, 📈 Rapports détaillés, 🏖️ Gestion des congés, 📱 Dispositifs biométriques.',
      placement: 'center',
      title: 'Fonctionnalités principales',
    },
    {
      target: '[data-tour="user-profile"]',
      content: 'Accédez à votre profil utilisateur, à vos paramètres et à la déconnexion via ce menu.',
      placement: 'bottom',
      title: 'Profil utilisateur',
    },
    {
      target: '[data-tour="tour-button"]',
      content: 'Retrouvez toutes les visites guidées ici ! Chaque module a sa propre visite détaillée. Vous pouvez relancer n\'importe quelle visite à tout moment.',
      placement: 'bottom',
      title: 'Visites guidées',
    },
  ],
};

// Titres des tours pour l'interface utilisateur
export const tourTitles: Record<string, string> = {
  dashboard: 'Découverte du tableau de bord',
  attendance: 'Gestion des présences',
  reports: 'Génération de rapports',
  employees: 'Gestion des employés',
  leaves: 'Gestion des congés',
  devices: 'Gestion des dispositifs',
  organization: 'Structure organisationnelle',
  admin: 'Utilisateurs et accès',
  settings: 'Paramètres du compte',
  onboarding: 'Premier pas dans KUILINGA',
};

// Configuration globale pour tous les tours
export const defaultTourOptions = {
  continuous: true,
  showProgress: true,
  showSkipButton: true,
  disableOverlayClose: false,
  disableCloseOnEsc: false,
  hideBackButton: false,
  spotlightClicks: false,
  locale: {
    back: 'Précédent',
    close: 'Fermer',
    last: 'Terminer',
    next: 'Suivant',
    open: 'Ouvrir',
    skip: 'Passer',
  },
};
