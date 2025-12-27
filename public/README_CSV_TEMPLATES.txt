Student Results CSV Upload Guide
===============================

This guide explains how to use the CSV templates for uploading student results.

TEMPLATES AVAILABLE:
-------------------
1. result_template.csv - Basic student information only
2. subjects_template.csv - Subjects and marks for existing students
3. student_results_complete_template.csv - Complete template with student info and subjects/marks

USING THE COMPLETE TEMPLATE (Recommended):
-----------------------------------------
The student_results_complete_template.csv allows you to upload both student information and their results in one file.

Steps:
1. Download the student_results_complete_template.csv file
2. Fill in the student information and their subject marks
3. Each row represents one subject for one student
4. For students with multiple subjects, add one row per subject
5. Save the file as CSV
6. In the admin panel, click "Upload Student Data CSV"
7. Select your completed CSV file

IMPORTANT NOTES:
---------------
- Roll Number must be exactly 6 digits
- Class Code should be unique per class
- Result Status can be either 'Pass' or 'Fail'
- Subject marks should be numerical values
- Each student can have multiple rows (one per subject)

EXAMPLE STRUCTURE:
-----------------
student_name,father_name,roll_no,class,class_code,result_status,grade,subject,marks
John Doe,Robert Doe,123456,10th,A101,Pass,A,Mathematics,85
John Doe,Robert Doe,123456,10th,A101,Pass,A,Science,78
Jane Smith,Michael Smith,123457,10th,A101,Pass,B,Mathematics,75