# Add new HRA Release and update all MD of the previous release to add to the new Release
from convert_old_release import get_digital_objects

import shutil
import glob
import time
import os
# python3 src/add-new-release.py v1-2 v1-3
import sys
ROOT_PATH = os.getcwd()+"/content/digital-objects/"
if __name__ == "__main__":
    if sys.argv[1] and sys.argv[2]:
        current_release = sys.argv[1]
        new_release = sys.argv[2]

    else:
        raise Exception("Release versions specified could not be found... Please re run the program with the correct paramaters.. ")
    shutil.copytree(ROOT_PATH+current_release+"/",ROOT_PATH+new_release+"/")
    time.sleep(5)
    files = glob.glob(ROOT_PATH+"/"+new_release+'/**/*.md', recursive=True)
    files = list(filter(lambda x: 'readme' not in x,files))
    flag=False
    
    insert_idx=0
    #print(files)
    #print(len(files))
    for file in files:
        print(file)
        file_lines=None
        with open(file,'r') as f:
            file_lines=f.readlines()
            #print(file_lines)
            for idx in range(len(file_lines)):
                if "release_version" in file_lines[idx]:
                    modify_index = idx
                if "model_type" in file_lines[idx]:
                    insert_idx=idx
            print(insert_idx)
            new_release_dir=new_release.replace("-",".")
            file_lines[modify_index-1]="release_version: "+new_release_dir+"\n"
            file_lines.insert(insert_idx,"  - "+new_release_dir+"\n")    
        with open(file,"w") as f:
            f.writelines(file_lines)                    


    
    
