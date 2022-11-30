import sys
import os
from tqdm import tqdm
from mdutils.mdutils import MdUtils
import pandas as pd
import glob
import argparse
from io import StringIO
import markdown    
import bs4
import shutil
import datetime
import unicodedata


def get_digital_objects(releases,root_path):
	digital_objects={}
	for rel in releases:
		files = glob.glob(root_path+"/"+rel+'/markdown/**/*.md', recursive=True)
		files = list(filter(lambda x: 'readme' not in x,files))
		digital_objects[rel]=files
	return digital_objects


def get_hra_versions(digital_objects):
	files_hra_versions = {}
	for release in digital_objects:
		files=digital_objects[release]
		for i in range(len(files)):
			title = get_title(digital_objects[release][i])
			if title in files_hra_versions:
				files_hra_versions[title].append(release)
			else:
				files_hra_versions[title] = [release]

	return files_hra_versions

def strip_accents(s):
   return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

def get_immediate_subdirectories(a_dir):
    return [name for name in os.listdir(a_dir) if os.path.isdir(os.path.join(a_dir, name))]

def delete_txt_files(text_files):
	for del_file in text_files:
		os.remove(del_file)

def get_description(file_lines,i):
	desc = file_lines[i+1]		
	## Replacing Character '”' with blanks
	desc=desc.replace(chr(8221),"")
	desc=desc.replace(chr(8220),"")
	len_desc = len(desc)
	desc = '\''+desc[:len_desc-1]+ '\''
	return desc

def get_title(file):
	return file.split("/")[-1].replace(".md","")


def get_model_type(file):
	return file.split("/")[-2]


def process_markdown(file,files_hra_versions):
	print(file)
	model_type = get_model_type(file)
	title = get_title(file)
	processed_individuals_dict = {}
	ind_orcid_dict={}
	individuals = []
	counter=0
	individuals_orcid = []
	lines=[]
	table_string = ""
	flag = False
	with open(file,'r') as f:
		file_lines = f.readlines()
		for i in range(0,len(file_lines)):
			line = file_lines[i]
			if flag:
				lines.append(line)
			else:
				counter +=1
				if "Description" in line:
					desc=get_description(file_lines,i)
					#print(desc)
				if "Label" in line:
					flag=True
					lines.append(line)
		for j in lines:
			table_string+=j
		df=pd.read_table(StringIO(table_string),header=0,sep = "|").dropna(axis=1,how='all').iloc[1:]
		df = df.replace('&ouml;','o', regex=True)
		processed_markdown = "---\n"
		processed_markdown += "title: "+ title+"\n"
		processed_markdown += "release_version: "+rel +"\n"
		processed_markdown += "hra_release_version:\n"
		for hra in files_hra_versions[title]:
			processed_markdown+="  - "+hra+"\n"
		processed_markdown += "type: "+ model_type +"\n"
		processed_markdown += "description: "+desc+"\n"	
		for row in df.itertuples():
			#print(row)
			if "*Creator(s):*" in row._1:
				if ";" in row._2:
					inds = row._2.split(";") 
				else:
					inds = row._2.split(",")
				for ind in inds:
					individuals.append(ind.strip())
			if "*Project Lead:*" in row._1:    
				if ";" in row._2:
					p_leads=row._2.split(";")
				else:
					p_leads=row._2.split(",")
				for p_l in p_leads:
					individuals.append(p_l.strip())
			if "Creator ORCID" in row._1 and 'creators' not in processed_markdown:
				processed_markdown+="creators:\n"
				creators = row._2.split(";")
				#print(creators)
				for creator in creators:
					temp = markdown.markdown(creator)
					orcid = bs4.BeautifulSoup(temp,'lxml').find("a")
					if orcid is None:
						orcid = row._2
					else:
						orcid = orcid.text 
					individuals_orcid.append(orcid.strip())
					#print(orcid)
					processed_markdown+="  - "+orcid+"\n"
			
			if  "Project Lead ORCID" in row._1:    
				processed_markdown+= "project_leads:\n"
				if ";" in row._2:
					project_leads = row._2.split(";")
				else:
					project_leads = row._2.split(",")
				for lead in project_leads:
					temp = markdown.markdown(lead)
					orc_pl = bs4.BeautifulSoup(temp,'lxml').find("a").text
					processed_markdown+="  - "+orc_pl+"\n"
					individuals_orcid.append(orc_pl)

			if  "*Reviewer(s):" in row._1:   
				if ";" in row._2:
					revs = row._2.split(";")
				else:
					revs = row._2.split(",")
				#print(revs)
				for r in revs:
					individuals.append(r.strip())
		
			if "Reviewer ORCID" in row._1 or "Reviewers ORCID" in row._1:
				processed_markdown+= "reviewers:\n"
				reviewers = row._2.split(";")
				#print("Reviewers\n")
				#print(review)
				for review in reviewers:
					temp =markdown.markdown(review)
					orc_re = bs4.BeautifulSoup(temp,'lxml').find('a').text
					processed_markdown+="  - "+orc_re+"\n"
					individuals_orcid.append(orc_re)
				#print(individuals_orcid)
			if "Creation Date" in row._1 or "*Date:*" in row._1:
				try:
					d = datetime.datetime.strptime(row._2.strip(),"%Y-%m-%d").isoformat()
				except:
					d = datetime.datetime.strptime(row._2.strip(),"%B %d, %Y").isoformat()
				#print(d)
				processed_markdown+="creation_date: "+d+"\n"

			if "License" in row._1:
				processed_markdown+="license: "+"CC BY 4.0\n"
			if "Publisher" in row._1:
				processed_markdown+="publisher: "+row._2+"\n"
			if "Funder" in row._1:
				processed_markdown+="funder: "+row._2+"\n"
			if "Award Number" in row._1:
				processed_markdown+="award_number: "+row._2+"\n"
			if "HuBMAP ID" in row._1:
				processed_markdown+="hubmap_id: "+row._2+"\n"
			if "*Data Table" in row._1 or "*2D Data:*" in row._1 or "*3D Data:*" in row._1:
				file=markdown.markdown(row._2)
				filename = bs4.BeautifulSoup(file,'lxml').find("a").get('href')
				processed_markdown+="datatable: "+filename.split("/")[-1]+"\n"
				
				#processed_markdown+="datatable: "
			if "DOI" in row._1:
				dois = markdown.markdown(row._2)
				doi = bs4.BeautifulSoup(dois,'lxml').find('a').text
				#print(doi)
				processed_markdown+="doi: "+doi+"\n"
		processed_markdown+="---"
		for p in range(len(individuals)):
			first_name,middle_name,last_name,full_name = None,None,None,None
			individuals_markdown = "---\n"
			individuals_markdown += "layout: layouts/individual.njk\n"
			individuals_markdown += "individual: \n"
			temp2 = individuals[p].split(" ")
			#print(len(temp2))

			if(len(temp2)==2):
				first_name = temp2[0]
				last_name = temp2[1]
				individuals_markdown += "  first_name: "+first_name+"\n"
				individuals_markdown += "  last_name: "+last_name+"\n"
				full_name = first_name+" "+last_name
				
			if(len(temp2)==3):
				first_name = temp2[0]
				middle_name = temp2[1]
				last_name = temp2[2]
				individuals_markdown += "  first_name: "+first_name+"\n"
				individuals_markdown += "  middle_name: "+middle_name+"\n"
				individuals_markdown += "  last_name: "+last_name+"\n"
				full_name = first_name+" "+middle_name+" "+last_name
			if(len(temp2)==4):
				first_name = temp2[0]
				middle_name=temp2[1]
				last_name = temp2[2]
				suffix = temp2[3]
				full_name = first_name+" "+middle_name+" "+last_name+" "+suffix
				individuals_markdown += "  first_name: "+first_name+"\n"
				individuals_markdown += "  middle_name: "+middle_name+"\n"
				individuals_markdown += "  last_name: "+last_name+" "+suffix+"\n"

			individuals_markdown += "  orcid: "+individuals_orcid[p] + "\n"
			individuals_markdown += "---"
			if individuals_orcid[p] not in ind_orcid_dict:
				ind_orcid_dict[individuals_orcid[p]]= full_name
			#print(individuals)
			#print(individuals_orcid)
			#print(ind_orcid_dict)
			dir_rel = rel.replace(".","-")
			if not os.path.isdir(output_path+"/"+dir_rel+"/"+model_type+"/docs"):
				os.makedirs(output_path+"/"+dir_rel+"/"+model_type+"/docs")
			if not os.path.isdir(output_path+"/individuals/"):
				os.makedirs(output_path+'/individuals/')
	
			with open(output_path+'/individuals/'+first_name.lower()+'.'+last_name.lower()+'.txt','w+') as f1:
				f1.write(individuals_markdown)
		
			shutil.copyfile(output_path+"/individuals/"+first_name.lower()+'.'+last_name.lower()+".txt",output_path+"/individuals/"+first_name.lower()+'.'+last_name.lower()+".md")
			text_files = glob.glob(output_path+"/individuals/*.txt", recursive=True)
			delete_txt_files(text_files)
		processed_individuals_dict[title]=ind_orcid_dict
		
		#print(processed_markdown)
		file_title = title.replace(".md","")
		#print(file_title)
		
		with open(r''+output_path+'/'+dir_rel+'/'+model_type+'/docs/'+file_title+'.txt','w+') as f2:
			f2.write(processed_markdown)
		shutil.copyfile(output_path+"/"+dir_rel+"/"+model_type+"/docs/"+file_title+".txt",output_path+"/"+dir_rel+"/"+model_type+"/docs/"+file_title+".md")
		#print(output_path+"/"+rel+"/"+model_type+"/"+file_title+".md")
		text_files = glob.glob(output_path+"/"+dir_rel+"/"+model_type+"/docs/*.txt", recursive=True)
		delete_txt_files(text_files)
			
	return processed_individuals_dict


if __name__ == "__main__":

	## Get the rootpath and output directory path
	parser = argparse.ArgumentParser(description='Python Script to generate CCF Release data')
	parser.add_argument('-p','--path',help = "Root Directory of the website")
	parser.add_argument('-o','--output',help = "Output Directory where data generated will be stored")
	args = parser.parse_args()	
	if args.path:
		root_path = args.path
	if args.output:
		output_path = args.output
	

	
	releases = get_immediate_subdirectories(root_path)
	releases.remove('.git')
	releases.reverse()
	digital_objects = get_digital_objects(releases,root_path)
	files_hra_versions = get_hra_versions(digital_objects)
	individual_dictionary = {}
	for rel in releases:
		## Get the list of markdown files from markdowm subdirectory:
		
		for obj in tqdm(range(len(digital_objects[rel]))):	
			processed_individuals=process_markdown(digital_objects[rel][obj],files_hra_versions)
			individual_dictionary[rel]=processed_individuals
			

			
				
		
