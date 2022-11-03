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
def strip_accents(s):
   return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')

def get_immediate_subdirectories(a_dir):
    return [name for name in os.listdir(a_dir)
            if os.path.isdir(os.path.join(a_dir, name))]

def delete_txt_files(text_files):
	for del_file in text_files:
		os.remove(del_file)

if __name__ == "__main__":
	parser = argparse.ArgumentParser(description='Python Script to generate CCF Release data')
	parser.add_argument('-p','--path',help = "Root Directory of the website")
	parser.add_argument('-o','--output',help = "Output Directory where data generated will be stored")
	args = parser.parse_args()	
	if args.path:
		root_path = args.path
	if args.output:
		output_path = args.output
	#print(root_path)
	releases = get_immediate_subdirectories(root_path)
	releases.remove('.git')
	releases.reverse()
	#print(releases)
	#print(sa)
	files_hra_versions = {}

	for rel in releases:
		files = glob.glob(root_path+"/"+rel+'/markdown/**/*.md', recursive=True)
		files = list(filter(lambda x: 'readme' not in x,files))
		print(len(files))
		#print(files)
		counter = 0
		table_strings = []
		for i in tqdm(range(len(files))):
			individuals = []
			individuals_orcid = []
			flag = False
			lines=[]
			temp_table_string = ""
			print(files[i])
			title = files[i].split("/")[-1]
			title=title.replace(".md","")
			if title in files_hra_versions:
				files_hra_versions[title].append(rel)
			else:
				files_hra_versions[title] = [rel]
			model_type = files[i].split("/")[-2]
			#print(title)
			f = open(files[i],'r')
			file_lines = f.readlines()
			for i in range(0,len(file_lines)):
				line = file_lines[i]
				if flag:
					lines.append(line)
				else:
					counter +=1
					if "Description" in line:
						desc = file_lines[i+1]
						#desc = desc.replace("“","")
						
						## Replacing Character '”' with blanks
						desc=desc.replace(chr(8221),"")
						desc=desc.replace(chr(8220),"")
						len_desc = len(desc)
						desc = '\''+desc[:len_desc-1]+ '\''
						#print(desc)
					if "Label" in line:
						flag=True
						lines.append(line)
		
			for j in lines:
				temp_table_string+=j
			#print(temp_table_string)
			df=pd.read_table(StringIO(temp_table_string),header=0,sep = "|").dropna(axis=1,how='all').iloc[1:]
			df = df.replace('&ouml;','o', regex=True)
			tableString=""
			#print(df)
			creators=[]
			reviewers=[]
			project_leads=[]
			ymlStringOutput = "---\n"
			ymlStringOutput += "title: "+ title+"\n"
			ymlStringOutput += "release_version: "+rel +"\n"
			ymlStringOutput += "hra_release_version:\n"
			for hra in files_hra_versions[title]:
				ymlStringOutput+="  - "+hra+"\n"
			ymlStringOutput += "model_type: "+ model_type +"\n"
			ymlStringOutput += "description: "+desc+"\n"	
			#print(df)
			for row in df.itertuples():
				#print(row)
				if "*Creator(s):*" in row._1:
					inds = row._2.split(";")
					for ind in inds:
						individuals.append(ind.strip())
				if "*Project Lead:*" in row._1:    
					p_leads=row._2.split(";")
					for p_l in p_leads:
						individuals.append(p_l.strip())
				if "Creator ORCID" in row._1 and 'creators' not in ymlStringOutput:
					ymlStringOutput+="creators:\n"
					creators = row._2.split(";")
					#print(creators)
					for creator in creators:
						temp = markdown.markdown(creator.strip())
						orcid = bs4.BeautifulSoup(temp,'lxml').find("a")
						if orcid is None:
							orcid = row._2
						else:
							orcid = orcid.text 
						individuals_orcid.append(orcid.strip())
					
						#print(orcid)
						ymlStringOutput+="  - "+orcid+"\n"
				
				if  "Project Lead ORCID" in row._1:    
					ymlStringOutput+= "project_leads:\n"
					project_leads = row._2.split(";")
					for lead in project_leads:
						temp = markdown.markdown(lead.strip())
						orc_pl = bs4.BeautifulSoup(temp,'lxml').find("a").text
						ymlStringOutput+="  - "+orc_pl+"\n"
						individuals_orcid.append(orc_pl)

				if  "*Reviewer(s):" in row._1:   
					revs = row._2.split(";")
					#print(revs)
					for r in revs:
						individuals.append(r.strip())
			
				if "Reviewer ORCID" in row._1 or "Reviewers ORCID" in row._1:
					ymlStringOutput+= "reviewers:\n"
					reviewers = row._2.split(";")
					#print("Reviewers\n")
					#print(review)
					for review in reviewers:
						temp =markdown.markdown(review)
						orc_re = bs4.BeautifulSoup(temp,'lxml').find('a').text
						ymlStringOutput+="  - "+orc_re+"\n"
						individuals_orcid.append(orc_re)
				#print(individuals_orcid)
				if "Creation Date" in row._1 or "*Date:*" in row._1:
					try:
						d = datetime.datetime.strptime(row._2.strip(),"%Y-%m-%d").isoformat()
					except:
						d = datetime.datetime.strptime(row._2.strip(),"%B %d, %Y").isoformat()
					#print(d)
					ymlStringOutput+="creation_date: "+d+"\n"

				if "License" in row._1:
					ymlStringOutput+="license: "+"CC BY 4.0\n"
				if "Publisher" in row._1:
					ymlStringOutput+="publisher: "+row._2+"\n"
				if "Funder" in row._1:
					ymlStringOutput+="funder: "+row._2+"\n"
				if "Award Number" in row._1:
					ymlStringOutput+="award_number: "+row._2+"\n"
				if "HuBMAP ID" in row._1:
					ymlStringOutput+="hubmap_id: "+row._2+"\n"
				if "*Data Table" in row._1 or "*2D Data:*" in row._1 or "*3D Data:*" in row._1:
					file=markdown.markdown(row._2)
					filename = bs4.BeautifulSoup(file,'lxml').find("a").get('href')
					ymlStringOutput+="datatable: "+filename.split("/")[-1]+"\n"
					#print(file)
					#ymlStringOutput+="datatable: "
				if "DOI" in row._1:
					dois = markdown.markdown(row._2)
					doi = bs4.BeautifulSoup(dois,'lxml').find('a').text
					#print(doi)
					ymlStringOutput+="doi: "+doi+"\n"
			
			#print(individuals_orcid)
			
			for p in range(len(individuals)):
				individualsString = "---\n"
				individualsString += "layout: layouts/individual.njk\n"
				individualsString += "individual: \n"
				temp2 = individuals[p].split(" ")
				#print(temp2)

				if(len(temp2)==2):
					individualsString += "  first_name: "+temp2[0]+"\n"
					individualsString += "  last_name: "+temp2[1]+"\n"
					first_name = temp2[0]
					last_name = temp2[1]
				if(len(temp2)==3):
					individualsString += "  first_name: "+temp2[0]+"\n"
					individualsString += "  middle_name: "+temp2[1]+"\n"
					individualsString += "  last_name: "+temp2[2]+"\n"
					first_name = temp2[0]
					last_name = temp2[2]
				individualsString += "  orcid: "+individuals_orcid[p] + "\n"
				individualsString += "---"
				#print(mn)
				#print(ln)
				#print(individualsString)
				if not os.path.isdir(output_path+"/"+rel+"/"+model_type):
					os.makedirs(output_path+"/"+rel+"/"+model_type)
				if not os.path.isdir(output_path+'/'+rel+'/individuals/'):
					os.makedirs(output_path+'/'+rel+'/individuals/')
			
				with open(output_path+'/'+rel+'/individuals/'+first_name.lower()+'.'+last_name.lower()+'.txt','w+') as f:
					f.write(individualsString)
				f.close()
				shutil.copyfile(output_path+"/"+ rel+"/individuals/"+first_name.lower()+'.'+last_name.lower()+".txt",output_path+"/"+rel+"/individuals/"+first_name.lower()+'.'+last_name.lower()+".md")
				text_files = glob.glob(output_path+"/"+rel+'/individuals/*.txt', recursive=True)
				delete_txt_files(text_files)
			ymlStringOutput+="---"
			#print(ymlStringOutput)
			file_title = title.replace(".md","")
			#print(file_title)
			with open(r''+output_path+"/"+rel+'/'+model_type+'/'+file_title+'.txt','w+') as f:
				f.write(ymlStringOutput)
			f.close()
			shutil.copyfile(output_path+"/"+rel+"/"+model_type+"/"+file_title+".txt",output_path+"/"+rel+"/"+model_type+"/"+file_title+".md")
			print(output_path+"/"+rel+"/"+model_type+"/"+file_title+".md")
			text_files = glob.glob(output_path+"/"+rel+"/"+model_type+'/*.txt', recursive=True)
			delete_txt_files(text_files)
			#print(text_files)
			#break
			

			
				
		
