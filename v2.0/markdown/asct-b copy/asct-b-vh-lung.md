# Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) table for Lung v1.4

### Description

Minor changes were made for Lung v1.4 to ensure all cell types were mapped to Cell Ontology or had a parent cell type that mapped to Cell Ontology and genes and proteins were mapped to the Human Gene Ontology (HUGO) Gene Nomenclature Committee (HGNC). Many new cell types for lung were added to Cell Ontology (CL) during this release cycle. 


Lung v1.3 simplified the ASCT+B table to represent a  “Single Lung Lobe” compared ot  Lung v1.1, to consider the anatomical and cellular composition of  the lower respiratory tract of one lung lobe as representative of the five human lung lobes, reducing table redundancies in structure and cell nomenclature and to improve visualization by the ASCT+B Reporter. 

In Lung v1.3, the Trachea and the Main Bronchus were split out into separate ASCT+B tables.  The Lung table v1.3 was thoroughly reviewed and revised. With the excellent assistance of Joshua Fortriede, Ellen Quardokus and Aleix Puig Barbe (EBI), Uberon and Cell Ontology were updated, terms added or revised where needed, AS-AS, AS-CT, CT-CT relationships corrected and verified. The provided gene markers were also reviewed and updated based on recent single cell transcriptomic lung cell type references.

The table begins with lower airway anatomical structure using as reference Gray's Anatomy The Anatomical Basis of Clinical Practice, the International Federation of Associations of Anatomists): Terminologia Anatomica (TA) and the LungMAP Anatomical Ontology.
References are provided for the identification of each cell type in each histologic structure (Ref/1).  Cell types were labeled up to the finest level of labeling available, and set to “None” if no cell type label was available at the level under consideration. Used Uberon and Cell Ontology entries used are as specific to lung and substructures as available (for example, “pericyte” became “lung pericyte CL:0009089”; endothelial cell of lymphatic vessel CL:002138  became “endothelial cell of respiratory system lymphatic vessel CL:0009086”, used pulmonary capillary endothelial cell CL:4028001 in non-alveolar regions but in alveoli used “alveolar capillary type 1 endothelial cell has ID CL:4028002” and “alveolar capillary type 2 endothelial cell CL:4028003”; pulmonary interstitial fibroblast are represented as “alveolar type 2 fibroblast cell CL 4028006” with synonyms type-2 associated stromal cell, MANC, adventitial fibroblast, matrix fibroblast 2, mesenchymal alveolar niche cell, AF2; and alveolar type 1 fibroblast cell CL 4028004 with synonyms alveolar fibroblast, matrix fibroblast 1, lipid interstitial cell, alveolar fibroblast 1, AF1; the identity of pulmonary lipofibroblast as independent cell type versus a subtype of AF1 remains under discussion in the lung community.
Where cells of similar type occur in different locations, the closest and highest level of resolution available is used. For example, Cell Ontology and/or the LungMAP Ontology recognizes ciliated columnar cell of tracheobronchial tree CL:0002145, ciliated cell for the bronchus CL:0002332, and ciliated cell of terminal ciliated ducts of submucosal glands LMHA:00142. But location specific marker genes are not yet consistently identified and so the same set of marker genes are used for each.
                    	
As previously, where more refined cell types are not available in the ontologies, the closest general term is used. For example, likely should distinguish between endothelial cell venous systemic and and endothelial cell venous pulmonary but for now using vein endothelial cell CL:0002543. However, a number of structural and cell type terms have been added to the Ontologies and/or are in provisional acceptance undergoing review.

The cell type gene markers have been revised from the previous Lung ASCT+B table.  The gene markers now selected are a harmonization of the Azimuth Human - Lung v2 https://azimuth.hubmapconsortium.org/references/#Human%20-%20Lung%20v2%20%28HLCA%29, markers from “An integrated cell atlas of the human lung in health and disease (IHLCA, grateful for the assistance of Dr. Nawijn) https://doi.org/10.1101/2022.03.10.483747, the original LungMAP Cell Cards publication https://doi.org/10.1016/j.devcel.2021.11.007  and the “Human CellCards Multi-Study CellRef 1.0 Atlas” doi: https://doi.org/10.1101/2022.05.18.491687 and can be reviewed at LungMAP.net. The cell type protein markers are classically referenced in the lung research literature and can be viewed in a number of references. A number of these markers will be demonstrated in multiplexed immunofluorescence data in preparation for HuBMAP portal.

Standardization of lung cell type nomenclature, ontology expansion, gene and protein marker identification continue under development now by a broad organization of experts in the field, organized in cell type task forces, initiated on April 19, 2022 at the University of California San Diego, at a Lung Nomenclature Summit organized by the Developmental Lung Molecular Atlas Program (LungMAP).


| Label | Value |
| :------------- |:-------------|
| **Creator(s):** | Gloria Pryhuber |
| **Creator ORCID(s):** | [0000-0002-9185-3994](https://orcid.org/0000-0002-9185-3994) |
| **Project Lead:** | Katy B&ouml;rner |
| **Project Lead ORCID:** | [0000-0002-3321-6137](https://orcid.org/0000-0002-3321-6137) |
| **Reviewer(s):** | Martijn Nawijn; Ellen Quardokus; Gail Deutsch|
| **Reviewer ORCID(s):** |[0000-0003-3372-6521](https://orcid.org/0000-0003-3372-6521); [0000-0001-7655-4833](https://orcid.org/0000-0001-7655-4833);[0000-0002-0571-0285](https://orcid.org/0000-0002-0571-0285)|
| **Creation Date:** | 2023-12-15 |
| **License:** | Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) |
| **Publisher:** | HuBMAP |
| **Funder:** | National Institutes of Health |
| **Award Number:** | OT2OD033756 and OT2OD026671 |
| **HuBMAP ID:** | HBM823.VZGJ.394 |
| **Data Table:** | [Lung v1.4](https://cdn.humanatlas.io/hra-releases/v2.0/asct-b/asct-b-vh-lung.csv)  |
| **DOI:** | [https://doi.org/10.48539/HBM823.VZGJ.394](https://doi.org/10.48539/HBM823.VZGJ.394) |
| **How to Cite This Data Table:** | Gloria Pryhuber. HuBMAP ASCT+B Tables. Lung v1.4 [https://doi.org/10.48539/HBM823.VZGJ.394](https://doi.org/10.48539/HBM823.VZGJ.394) |
| **How to Cite ASCT+B Tables Overall:** | Quardokus, Ellen, Bruce W. Herr II, Lisel Record, Katy B&ouml;rner. 2023. [*HuBMAP ASCT+B Tables*](https://humanatlas.io/asctb-tables). Accessed on December 15, 2023. |
