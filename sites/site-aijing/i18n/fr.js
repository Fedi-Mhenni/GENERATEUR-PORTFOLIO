export default {
    meta: {title: "Aijing Li — Portfolio", description: "Portfolio d’Aijing Li, développeuse créative et UI designer."},
    routes: {
        home: "/fr",
        about: "/fr/a-propos",
        projects: "/fr/projets",
        project: "/fr/projets/:slug",
        privacy: "/fr/politique-de-confidentialite"
    },
    nav: {
        home: "Accueil",
        about: "À propos",
        projects: "Projets",
        contact: "Contact",
        primaryLabel: "Navigation principale",
        languageLabel: "Sélecteur de langue"
    },
    layout: {skipToContent: "Aller au contenu principal", backToTop: "Retour en haut"},
    home: {
        heroEyebrow: "01 /",
        heroTitle: "Aijing Li",
        heroIntroduction: "Développeuse créative et UI designer, j’explore des expériences numériques réfléchies.",
        heroCta: "À PROPOS",
        latestProjectsEyebrow: "02 / PROJETS SÉLECTIONNÉS",
        latestProjectsTitle: "Derniers projets",
        projectDetailLabel: "Voir le détail du projet",
        projectsCta: "Voir tous les projets",
        loading: "Chargement des derniers projets…",
        unavailable: "Les derniers projets sont temporairement indisponibles.",
        empty: "Aucun projet n’est encore disponible."
    },
    contact: {
        title: "Contact",
        introduction: "Un projet, une question ou une idée à partager ? Envoyez-moi un message.",
        formLabel: "Formulaire de contact",
        nameLabel: "Nom",
        namePlaceholder: "Votre nom",
        emailLabel: "E-mail",
        emailPlaceholder: "nom@exemple.com",
        messageLabel: "Message",
        messagePlaceholder: "Écrivez votre message…",
        acknowledgement: "J’ai lu et compris la",
        privacyLink: "Politique de confidentialité",
        submit: "Envoyer le message",
        sending: "Envoi du message…",
        success: "Message envoyé. Merci !",
        error: "Le message n’a pas pu être envoyé. Veuillez réessayer."
    },
    social: {linkedin: "LinkedIn", github: "GitHub", email: "E-mail"},
    projects: {
        eyebrow: "01 / ARCHIVES",
        title: "Projets",
        introduction: "Une sélection de projets scolaires et personnels.",
        unavailable: "Les projets sont temporairement indisponibles.",
        previous: "← Précédent",
        next: "Suivant →",
        paginationLabel: "Pagination des projets",
        paginationUnavailable: "La pagination est indisponible."
    },
    about: {
        eyebrow: "01 / À PROPOS",
        title: "À propos de moi",
        profileUnavailable: "Les informations de profil sont temporairement indisponibles.",
        downloadCv: "Télécharger le CV",
        loadingTitle: "Chargement de la page À propos…",
        loadingCopy: "Le profil, les compétences et les expériences se chargent.",
        unavailableTitle: "La page À propos est indisponible",
        unavailableCopy: "La page est temporairement indisponible. Veuillez réessayer plus tard.",
        partialUnavailable: "Certaines informations de profil sont temporairement indisponibles.",
        skillsLabel: "02 / PRATIQUE",
        skillsTitle: "Compétences",
        educationLabel: "03 / FORMATION",
        experiencesLabel: "04 / EXPÉRIENCES"
    },
    project: {
        datePrefix: "DATE",
        back: "Retour aux projets",
        loadingTitle: "Chargement du projet…",
        loadingCopy: "Les détails du projet se chargent.",
        unavailableTitle: "Projet indisponible",
        unavailableCopy: "Les détails du projet sont temporairement indisponibles.",
        notFoundTitle: "Projet introuvable",
        notFoundCopy: "Ce projet n’existe pas ou n’est plus disponible.",
        navigationLabel: "Navigation entre les projets",
        previous: "← Projet précédent",
        next: "Projet suivant →",
        galleryLabel: "04 / VUES DU PROJET",
        galleryTitle: "Fragments du système",
        contextLabel: "01 / CONTEXTE",
        contextTitle: "Contexte et objectif",
        processLabel: "02 / PROCESSUS",
        processTitle: "Processus",
        solutionLabel: "03 / SOLUTION",
        solutionTitle: "Solution et résultat"
    },
    notFound: {title: "Page introuvable", copy: "Cette page n’existe pas."},
    privacy: {
        eyebrow: "LÉGAL / CONFIDENTIALITÉ",
        title: "Politique de confidentialité",
        updated: "Dernière mise à jour : 7 septembre 2026",
        introduction: "La présente politique de confidentialité explique comment ce site traite les données personnelles des personnes qui le consultent ou utilisent le formulaire de contact, conformément au Règlement général sur la protection des données (« RGPD »).",
        controller: {
            title: "1. Responsable du traitement",
            intro: "Le responsable du traitement est :",
            email: "E-mail :"
        },
        data: {
            title: "2. Données personnelles collectées",
            intro: "Lorsque vous utilisez le formulaire de contact, les données suivantes peuvent être collectées :",
            items: ["Votre nom", "Votre adresse e-mail", "Le contenu de votre message"],
            technical: "Des informations techniques, telles que votre adresse IP et les informations relatives à votre navigateur, peuvent aussi être traitées par l’hébergeur et EmailJS à des fins de sécurité et de fonctionnement du service."
        },
        purpose: {
            title: "3. Finalités du traitement",
            intro: "Vos données personnelles sont utilisées uniquement pour :",
            items: ["Lire votre message et y répondre ;", "Communiquer avec vous au sujet de votre demande ;", "Protéger le site et le service d’e-mail contre les abus, le spam ou les incidents de sécurité."],
            outro: "Vos données ne sont pas utilisées à des fins publicitaires, de profilage ou de newsletter, et ne sont pas vendues à des tiers."
        },
        legalBasis: {
            title: "4. Base légale",
            text: "Le traitement des données du formulaire de contact repose sur l’intérêt légitime du propriétaire du site à répondre aux messages et demandes reçus via le site.",
            objection: "Vous pouvez vous opposer à ce traitement à tout moment en nous contactant."
        },
        recipients: {
            title: "5. Destinataires des données",
            emailjs: "Votre message est envoyé via EmailJS, un service d’envoi d’e-mails agissant en tant que sous-traitant.",
            mailbox: "Le message est ensuite reçu dans la boîte e-mail du responsable du traitement. Il n’est pas enregistré dans une base de données de ce site.",
            infrastructure: "Les données personnelles peuvent également être traitées par l’hébergeur du site et le fournisseur de l’API Strapi lorsque cela est nécessaire au fonctionnement et à la sécurité du site."
        },
        retention: {
            title: "6. Durée de conservation",
            intro: "Les messages envoyés via le formulaire de contact sont conservés uniquement pendant la durée nécessaire au traitement de votre demande.",
            period: "Les messages sont supprimés au plus tard 12 mois après le dernier échange, sauf si une conservation plus longue est nécessaire pour respecter une obligation légale ou établir, exercer ou défendre des droits en justice."
        },
        cookies: {
            title: "7. Cookies et technologies de suivi",
            none: "Ce site n’utilise actuellement ni cookies publicitaires, ni cookies d’analyse d’audience, ni autres technologies de suivi.",
            banner: "Aucun bandeau de consentement aux cookies n’est nécessaire tant qu’aucun cookie ou traceur non essentiel n’est utilisé. Si cela change, cette politique sera mise à jour et votre consentement sera demandé lorsque nécessaire."
        },
        security: {
            title: "8. Sécurité des données",
            measures: "Des mesures techniques et organisationnelles appropriées sont mises en œuvre pour protéger les données personnelles contre l’accès non autorisé, la perte, l’altération ou la divulgation.",
            caveat: "Toutefois, aucune transmission de données sur Internet ne peut être garantie comme totalement sécurisée."
        },
        transfers: {
            title: "9. Transferts internationaux de données",
            location: "EmailJS peut traiter des données personnelles en dehors de l’Espace économique européen, notamment aux États-Unis.",
            safeguards: "Lorsque de tels transferts ont lieu, EmailJS met en œuvre des garanties appropriées, telles que les clauses contractuelles types, conformément au droit applicable en matière de protection des données."
        },
        rights: {
            title: "10. Vos droits",
            intro: "Conformément au RGPD, vous disposez des droits suivants :",
            items: ["Accéder à vos données personnelles ;", "Demander la rectification de données inexactes ;", "Demander l’effacement de vos données ;", "Demander la limitation du traitement ;", "Vous opposer au traitement ;", "Demander la portabilité de vos données, lorsque ce droit est applicable."],
            contact: "Pour exercer ces droits, contactez :"
        },
        complaint: {
            title: "11. Réclamation auprès de la CNIL",
            intro: "Si vous estimez que vos données personnelles ne sont pas traitées conformément au droit applicable, vous pouvez adresser une réclamation à l’autorité française de protection des données :",
            cnil: "CNIL — Commission Nationale de l’Informatique et des Libertés",
            link: "Consulter la page de réclamation de la CNIL (nouvel onglet)"
        },
        changes: {
            title: "12. Modifications de cette politique",
            text: "Cette politique de confidentialité peut être mise à jour en cas d’évolution du site, de ses services ou des exigences légales applicables.",
            latest: "La version la plus récente sera toujours disponible sur cette page."
        },
        contact: {
            title: "13. Contact",
            intro: "Pour toute question relative à cette politique de confidentialité ou au traitement de vos données personnelles, veuillez contacter :"
        },
    },
};
