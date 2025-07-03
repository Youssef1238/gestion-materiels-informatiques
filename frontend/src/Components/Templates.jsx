import React from "react";

const templates = [
  { name: "Template de Marche", downloadLink: "../../public/templates/ArticleLivreTemplate.xlsx" },
  { name: "Template de Fournisseur", downloadLink: "../../public/templates/FournisseurTemplate.xlsx" },
  { name: "Template de Entité Administrative", downloadLink: "../../public/templates/EntiteTemplate.xlsx" },
  { name: "Template de Article Marche", downloadLink: "../../public/templates/ArticleMarcheTemplate.xlsx" },
  { name: "Template de Article Livre", downloadLink: "../../public/templates/ArticleLivreTemplate.xlsx" },
  { name: "Template de Type", downloadLink: "../../public/templates/TypeTemplate.xlsx" },
];

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M12 16a1 1 0 0 0 .707-.293l4-4a1 1 0 1 0-1.414-1.414L13 12.586V3a1 1 0 1 0-2 0v9.586L8.707 10.293a1 1 0 0 0-1.414 1.414l4 4A1 1 0 0 0 12 16z" />
    <path d="M4 19a1 1 0 1 0 0 2h16a1 1 0 1 0 0-2H4z" />
  </svg>
);

const Templates = () => {
  return (
    <div className="min-h-screen text-gray-800 p-6 w-full">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center">
        Excel Templates
      </h1>
      <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-1">
        {templates.map((template, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-green-600 w-auto"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              {template.name}
            </h2>
            <a
              href={template.downloadLink}
              download
              className="flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-500 transition-colors"
              title={`Download ${template.name}`}
            >
              <DownloadIcon />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Templates;
