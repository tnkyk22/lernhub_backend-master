## วิธีการติดตั้ง และ วิธีใช้

 1.  หลังจาก clone project ใช้คำสั่งลงใน terminal
 
		 npm i
    
 2. สร้างไฟล์ .env ใช้ key ตามไฟล์ .env.example
 3. ใช้คำสั้ง

   
	    npx prisma generate

 4. ใช้คำสั้ง
 
	    npm run seed
	เพื่อสร้าง admin คนแรกจะได้รหัส email: admin@mail.com password: admin1234

## api user
 1. login

	    /api/user/login
    
	method: post
	body ที่รับ Email Password
	
 2. register
 

	    /api/user/register
	method: post
	body ที่รับ Email, Password, UserName, telephone
	

 3. sheet * อับโหลดชีท

	    /api/sheet
	method: post
	body-form-data ที่รับ:
	sheet : file
	thumnail : file
	Title : string
	NoteType : string *ใส่ Sheet หรือ Note
	CreatedById : int *ใส่รหัสคนอัพโหลด
	majorId : int *ใส่รหัสคณะ