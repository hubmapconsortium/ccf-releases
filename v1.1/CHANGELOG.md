**HuBMAP 3D Reference Objects ccf-release v1.1 Release Notes**

The following reference organs were added with ccf-release v1.1:
1.	eye
2.	fallopian tube
3.	knee
4.	liver
5.	ovary
6.	pancreas
7.	prostate
8.	small intestine
9.	ureter
10.	urethra
11.	urinary bladder
12.	uterus
Changes to ccf-release v1.0 models include:
1.	All female models (with exception to the Allen Brain) were stretched in the Z-axis to accommodate for an error introduced by a derivative visible human dataset for v1.0.  The original visible human data was used to rescale v1.1 models.
2.	The male and female Allen Brains were scaled, repositioned, and rotated to better fit the skin and align with the new eye models
3.	Vasculature for the uterus, eye, and liver was added to the vasculature model
4.	The optic chiasm was added to the Allen Brain models
5.	The nerves, ducts, muscles, some ligaments, and vasculature for organs are split according to 3D Reference Objects.  Since these splittings were for UI/back-end reasons, while certain vessels are associated with many organs as general pathways, any one vessel is only ever in one blood vasculature “group”.
6.	The partial ureters were removed from the v1.0 kidney models as a complete ureter organ is now available
7.	The heart models now include complete aortas and no longer include the left common carotid, brachiocephalic trunk, or left subclavian.  These vessels are also included in the complete blood vasculature model.
8.	Minor adjustments were made to several vessels, the skin, and the large intestine to accommodate the new organs.
