// ฟังก์ชันหน่วงเวลา
const delay = ms => new Promise(res => setTimeout(res, ms));

async function runDelete3Sec() {
    console.log("--- เริ่มต้นระบบลบโพสต์ (หน่วงเวลา 3 วินาที) ---");
    
    let notFoundCount = 0;

    while (true) {
        try {
            // 1. ค้นหาปุ่ม ...
            let actionButtons = document.querySelectorAll('div[aria-label="การดำเนินการสำหรับโพสต์นี้"]');
            if (actionButtons.length === 0) actionButtons = document.querySelectorAll('div[aria-label="Actions for this post"]');

            // กรณีไม่เจอปุ่ม -> เลื่อนลงเพื่อโหลดเพิ่ม
            if (actionButtons.length === 0) {
                notFoundCount++;
                console.log(`🔄 ไม่พบโพสต์... เลื่อนโหลดเพิ่ม (รอบที่ ${notFoundCount}/3)`);
                window.scrollTo(0, document.body.scrollHeight);
                await delay(5000); // รอโหลด 5 วิ

                if (notFoundCount >= 3) {
                    console.log("🎉 หมดเกลี้ยงแล้ว!");
                    break;
                }
                continue;
            }

            // กรณีเจอโพสต์ -> เริ่มลบ
            notFoundCount = 0;
            let btn = actionButtons[0]; // ลบตัวบนสุด

            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(1000); 
            btn.click();
            await delay(2500); // รอเมนูเด้ง

            // กดเมนู "ลบโพสต์"
            let menuItems = document.querySelectorAll('div[role="menuitem"]');
            let deleteMenuOption = Array.from(menuItems).find(el => el.innerText.includes('ลบโพสต์') || el.innerText.includes('Remove post'));

            if (deleteMenuOption) {
                deleteMenuOption.click();
                await delay(2500); // รอ Popup เด้ง

                // หากล่องยืนยัน
                let allDialogs = document.querySelectorAll('div[role="dialog"]');
                let targetDialog = Array.from(allDialogs).find(d => {
                    let text = d.innerText;
                    return text.includes('แน่ใจ') || text.includes('ลบ') || text.includes('ยืนยัน') || text.includes('Confirm');
                });

                if (targetDialog) {
                    let buttonsInDialog = targetDialog.querySelectorAll('div[role="button"]');
                    let confirmBtn = buttonsInDialog[buttonsInDialog.length - 1];
                    
                    if (confirmBtn && (confirmBtn.innerText.includes('ยกเลิก') || confirmBtn.innerText.includes('Cancel'))) {
                        confirmBtn = buttonsInDialog[buttonsInDialog.length - 2];
                    }

                    if (confirmBtn) {
                        confirmBtn.click();
                        console.log("✅ ลบสำเร็จ!");
                        
                        // **** จุดแก้ไข: หน่วงเวลา 3 วินาที ****
                        console.log("⏳ รอ 3 วินาที...");
                        await delay(3000); 
                    } else {
                        console.log("❌ หาปุ่มยืนยันไม่เจอ");
                        document.body.click(); 
                    }
                } else {
                    console.log("❌ ไม่เจอ Popup ยืนยัน");
                    document.body.click(); 
                }
            } else {
                console.log("⚠️ ลบไม่ได้ (ข้าม)");
                document.body.click(); 
                window.scrollBy(0, 300); 
                await delay(1000);
            }

        } catch (error) {
            console.error("Error:", error);
            document.body.click(); 
            await delay(2000);
        }
    }
    console.log("--- จบการทำงาน ---");
}

runDelete3Sec();
