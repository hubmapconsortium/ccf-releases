# Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) table for Lung v1.2

### Description
[Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) tables](https://hubmapconsortium.github.io/ccf/pages/ccf-anatomical-structures.html) aim to capture the nested *part_of* structure of anatomical human body parts, the typology of cells, and biomarkers used to identify cell types. The tables are authored and reviewed by an international team of experts. This “Single Lung Lobe” table simplifies the ASCT+B table from Lung v1.1, to consider the anatomical and cellular composition of  the lower respiratory tract of one lung lobe as representative of the five human lung lobes, reducing table redundancies in structure and cell nomenclature and to improve visualization by the ASCT+B Reporter. 

The table begins with lower airway anatomical structure using as reference Gray's Anatomy The Anatomical Basis of Clinical Practice, the International Federation of Associations of Anatomists): Terminologia Anatomica (TA) and the LungMAP Anatomical Ontology.
References are provided for the identification of each cell type in each histologic structure (Ref/1).  Cell types were labeled up to the finest level of labeling available, and set to “None” if no cell type label was available at the level under consideration. Used Uberon and Cell Ontology entries used are as specific to lung and substructures as available (for example, “pericyte” became “lung pericyte CL:0009089”; endothelial cell of lymphatic vessel CL:002138  became “endothelial cell of respiratory system lymphatic vessel CL:0009086”, used pulmonary capillary endothelial cell CL:4028001 in non-alveolar regions but in alveoli used “alveolar capillary type 1 endothelial cell has ID CL:4028002” and “alveolar capillary type 2 endothelial cell CL:4028003”; pulmonary interstitial fibroblast are represented as “alveolar type 2 fibroblast cell CL 4028006” with synonyms type-2 associated stromal cell, MANC, adventitial fibroblast, matrix fibroblast 2, mesenchymal alveolar niche cell, AF2; and alveolar type 1 fibroblast cell CL 4028004 with synonyms alveolar fibroblast, matrix fibroblast 1, lipid interstitial cell, alveolar fibroblast 1, AF1; the identity of pulmonary lipofibroblast as independent cell type versus a subtype of AF1 remains under discussion in the lung community.
Where cells of similar type occur in different locations, the closest and highest level of resolution available is used. For example, Cell Ontology and/or the LungMAP Ontology recognizes ciliated columnar cell of tracheobronchial tree CL:0002145, ciliated cell for the bronchus CL:0002332, and ciliated cell of terminal ciliated ducts of submucosal glands LMHA:00142. But location specific marker genes are not yet consistently identified and so the same set of marker genes are used for each.
                        
Where more refined cell types are not available in the ontologies, the closest general term is used. For example, likely should distinguish between endothelial cell venous systemic and and endothelial cell venous pulmonary but for now using vein endothelial cell CL:0002543.
 
Added are “brush cell of lobular bronchiole CL_0002205”, “brush cell of terminal bronchiole CL_0002206”  but removed are submucosal secretory cell of ciliated duct as references are sparse. Also removed serous cell of epithelium of trachea CL:1000330 for lack of references. Chose not to include CD4+ cytotoxic lymphocyte (granzyme and perforin producing, CD8 and NK like) as these are usually disease related and specific markers are lacking.  Removed CD4 and CD8 central memory as less likely to be resident cells.
 
Used [(Goldfarbmuren et al. 2020)](https://doi.org/10.1038/s41467-020-16239-z) as primary reference for submucosal gland basal cell and myoepithelial cell markers.

The cell type gene markers included take reference from the LungMAP Cell Cards publication and can be reviewed at LungMAP.net. The cell type protein markers are classically referenced in the lung research literature and can be viewed in a number of references.

Standardization of lung cell type nomenclature, ontology expansion, gene and protein marker identification are under development now by a broad organization of experts in the field, initiated on April 19, 2022 at the University of California San Diego, at a Lung Nomenclature Summit organized by the Developmental Lung Molecular Atlas Program (LungMAP).


| Label | Value |
| :------------- |:-------------|
| **Creator(s):** | Gloria Pryhuber |
| **Creator ORCID(s):** | [0000-0002-9185-3994](https://orcid.org/0000-0002-9185-3994) |
| **Project Lead:** | Katy B&ouml;rner |
| **Project Lead ORCID:** | [0000-0002-3321-6137](https://orcid.org/0000-0002-3321-6137) |
| **Reviewer(s):** | Bruce Aronow; Joshua Fortriede|
| **Reviewer ORCID(s):** |[0000-0001-5109-6514 ](https://orcid.org/0000-0001-5109-6514); [0000-0002-3293-5463](https://orcid.org/0000-0002-3293-5463)|
| **Creation Date:** | 2021-05-06 |
| **License:** | Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) |
| **Publisher:** | HuBMAP |
| **Funder:** | National Institutes of Health |
| **Award Number:** | OT2OD026671 |
| **HuBMAP ID:** | HBM396.QVLQ.449 |
| **Data Table:** | [Lung v1.2](https://hubmapconsortium.github.io/ccf-releases/v1.2/asct-b/ASCT-B_VH_Lung.csv)  |
| **DOI:** | [https://doi.org/10.48539/HBM396.QVLQ.449](https://doi.org/10.48539/HBM396.QVLQ.449) |
| **How to Cite This Data Table:** | Gloria Pryhuber. HuBMAP ASCT+B Tables. Lung v1.2 [https://doi.org/10.48539/HBM396.QVLQ.449](https://doi.org/10.48539/HBM396.QVLQ.449) |
| **How to Cite ASCT+B Tables Overall:** | Quardokus, Ellen, Bruce W. Herr II, Lisel Record, Katy B&ouml;rner. 2022. *HuBMAP ASCT+B Tables*. https://hubmapconsortium.github.io/ccf/pages/ccf-anatomical-structures.html. Accessed on May 6, 2022. |
