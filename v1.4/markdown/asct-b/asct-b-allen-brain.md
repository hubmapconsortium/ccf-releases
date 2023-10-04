# Anatomical Structures, Cell Types, plus Biomarkers (ASCT+B) table for Brain, v1.4

### Description
This is a major update of the CT+B component of the table that extends it from well-curated high-resolution cell types in a single small brain region (DOI: 10.1038/s41586-021-03465-8), to also include a first draft of cell types across the entire human brain (DOI: 10.1101/2022.10.12.511898).  There are no changes to the AS part of the table, EXCEPT adding the appropriate reference (DOI: 10.1002/cne.24080) in each row of the table corresponding to anatomic structures.  Similarly, there are no changes to rows relating to cell types from v1.3 of this table, EXCEPT adding “Human - Motor Cortex” in the “CT/1/NOTES” slot to distinguish these cell types from the newly added whole brain atlas types described in detail below. In addition, Kimberly Siletti has replaced Raymond Sanchez as an author of this table, as the updated CT components represent work that she led and participated in converting to this format.

The new information cell type names and locations for the CT+B component of the table are derived from Table S2 from Siletti et al 2023, representing the 461 superclusters defined therein. Biomarkers for these clusters were defined using NS-Forest markers as described in more detail below. The conversion from Table S2 to this ASCT+B table was done as follows, where [bracketed] represent column names from Table S2: 
* ANATOMIC STRUCTURES: (for the CT+B rows only.  ‘AS’ rows are unchanged as mentioned)
  * Define anatomic structure using the ‘[Top three regions]’ column, as follows:
    *	Define a threshold of 90%
    *	If the sum of top three regional percentages is lower than the threshold, assume there is no clear regional preference and set “brain” as the structure.
    * Otherwise, take the first N regions (where N is the lowest value for which cumulative sum of regional preferences exceeds the threshold) and define the structure as the lowest parent in the AS component of the ASCT+B table for which regions[1:N] are children.
  *	AS/#: Match the AS hierarchy down to the relevant structure 
  *	Note: conversion between regions in the HuBMAP AS table and the brain regions listed in ‘[Top three dissections]’ was done through the BrainSpan ontology using this API call: http://api.brain-map.org/api/v2/data/query.csv?criteria=model::Structure,rma::criteria,[ontology_id$eq11],rma::options[order$eq%27structures.graph_order%27][num_rows$eqall]
* CELL TYPES
  *	CT/1 and CT/1/LABEL: Cell type label for the highest resolution parent type present in cell ontology (CL). This term is usually, but not always taken from the “Supercluster” identity.
  *	CT/1/ID: CL term for the CT/1 cell type
  *	CT/1/NOTES: This is empty, except in a few cases when alternative or different resolution CL terms are available, in which case these and their corresponding labels are listed.
  *	CT/2: ‘[Cluster name]’ (e.g., ‘URL_310’)
  *	CT/2/LABEL (e.g., longer name): ‘[Cluster name] [Supercluster] [“Neuron” or “Non-neuron”] of [Anatomic structure]’  (e.g., ‘URL_310 Upper rhombic lip Neuron of gray matter of hindbrain’) *See note above about Anatomic structure(s)
  *	CT/2/ID: [empty] (This will get filled in in a later version when PCL IDs are assigned.)
  *	CT/2/NOTES: [Transferred MTG Label] which provides a linkage back to published cell types in middle temporal gyrus, and will allow imperfect matching with the M1 cell types labeled as “Human - Motor Cortex” in the “CT/1/NOTES”
* BIOMARKERS
  *	All Gene Biomarkers: Derived from a separate NS-Forest analysis, which identified a set of between 1-6 genes that optimally discriminate a given cell type from the 460 others.
  *	BGene/#: Gene symbol from manuscript (e.g., ‘CBLN4’)
  *	BGene/#/LABEL: Full HGNC gene label if conversion to HGNC is possible (e.g., ‘cerebellin 4 precursor’)
  *	BGene/#/ID: Full HGNC gene ID if conversion to HGNC is possible (e.g., ‘HGNC:17178’)

The following changes are anticipated for future versions:
1.	Extension of the “AS” rows to include more detailed anatomic structures in the Allen human brain atlas (or other atlas[es] agreed-upon by BICAN)
2.	Extension to higher-resolution cell types brain-wide
3.	Integration of cell types in primary motor cortex (defined in v1.3 and carried over to v1.4) with new cell types defined brain-wide and included in v1.4 
4.	Mapping of Cell Ontology (CL) or Provisional Cell Ontology (PCL) terms to whole brain cell types in the “CT/1/ID” column, at the highest resolution possible


Application of NS-Forest 

NS-Forest (as described in this manuscript: DOI: 10.1101/gr.275569.121) was applied to the Siletti et al data set using the following strategy. 
0.	We created a downsampled data, which sets a cap of the cluster size at 500 for all 461 clusters. This data set was used for marker gene selection in most cases and is referred to as “sampled_WHB”
1.	In run 1, we generated markers using three strategies. Run 1 serves as an initial selection of marker genes at multiple levels to define a pool of markers for a Run 2.
a.	We used NS-Forest to generate a marker gene list for each of the clusters for each supercluster dataset from cellxgene using all cells. These represent local markers (e.g., clusters within superclusters) for all data.
b.	We performed NS-Forest at the cluster level using the sampled_WHB dataset. These represent global markers but only for a subset of the data.
c.	We performed NS-Forest at the supercluster level using the sampled_WHB dataset. This run pulls out markers for less fine-resolution cell types.
2.	In run 2, we pooled the three marker gene lists (described above) together, which led to 1091 unique genes. In the reduced gene space, we performed NS-Forest again using the sampled_WHB dataset, which gave the results reported. The rationale for run 2 is that the reduced gene space could help the random forest algorithm to search for the most informative genes more efficiently. We observed higher overall f-beta score and PPV (positive predictive value) from run 2 than run 1.

| Label | Value |
| :------------- |:-------------|
| **Creator(s):** | Jeremy A. Miller; Kimberly Siletti; Richard H. Scheuermann |
| **Creator ORCID(s):** | [0000-0003-4549-588X](https://orcid.org/0000-0003-4549-588X); [0000-0001-7620-8973](https://orcid.org/0000-0001-7620-8973); [0000-0003-1355-892X](https://orcid.org/0000-0003-1355-892X)|
| **Project Lead:** | Katy B&ouml;rner |
| **Project Lead ORCID:** | [0000-0002-3321-6137](https://orcid.org/0000-0002-3321-6137) |
| **Reviewer(s):** | Ed Lein; David Osumi-Sutherland; Ellen M. Quardokus 
| **Reviewers ORCID(s):** |[0000-0001-9012-6552](https://orcid.org/0000-0001-9012-6552); [0000-0002-7073-9172](https://orcid.org/0000-0002-7073-9172); [0000-0001-7655-4833](https://orcid.org/0000-0001-7655-4833)|
| **Creation Date:** | 2023-06-15 |
| **License:** | Creative Commons Attribution 4.0 International ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) |
| **Publisher:** | HuBMAP |
| **Funder:** | National Institutes of Health |
| **Award Number:** | OT2OD026671 |
| **HuBMAP ID:** | HBM568.VJBK.732 |
| **Data Table:** |[Brain v1.4](https://cdn.humanatlas.io/hra-releases/v1.4/asct-b/asct-b-allen-brain.csv)|
| **DOI:** | [https://doi.org/10.48539/HBM568.VJBK.732](https://doi.org/10.48539/HBM568.VJBK.732) |
| **How to Cite This Data Table:** |  Jeremy A. Miller; Raymond Sanchez; Richard Scheuermann. HuBMAP ASCT+B Tables. Brain v1.4,https://doi.org/10.48539/HBM568.VJBK.732, Accessed on June 15, 2023.|
| **How to Cite ASCT+B Tables Overall:** | Quardokus, Ellen, Bruce W. Herr II, Lisel Record, Katy B&ouml;rner. 2023. [*HuBMAP ASCT+B Tables*](https://humanatlas.io/asctb-tables). Accessed on June 15, 2023. |
