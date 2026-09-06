export default async function ProjectDetailPage({ slug } = {}) {
    return {
        type:"main",
        attributes:[["class", ["project-detail-placeholder"]]],
        children: [
            { type: "h1", children: ["Project detail"] },
            {
                type: "p",
                children: [
                    slug
                        ? `Le détail de « ${slug} » est en cours d’intégration.`
                        : "Le détail du projet est en cours d’intégration.",
                ],
            },
        ],
    }
}
