    // ==========================================
    // সুপাবেস কনফিগারেশন (আপনার দেওয়া তথ্য)
    // ==========================================
    const SUPABASE_URL = 'https://tamdnljthbvemhcrrtry.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_esm_aUN7S4tCf3nbt4BoSw_yXlnlRBX';
    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    let selectedVehicle = 'auto';
    
    // জোনের জিপিএস ডেটা
    const zones = {
        'A': { lat: 24.888385470902648, lon: 90.71699133975075 }, 'B': { lat: 24.887346266341627, lon: 90.72297826741213 },
        'C': { lat: 24.88607242711381, lon: 90.72831085467494 }, 'D': { lat: 24.88499119188133, lon: 90.73233559838015 },
        'E': { lat: 24.880844783195897, lon: 90.73191426613448 }, 'F': { lat: 24.87377597998706, lon: 90.72897459526679 },
        'G': { lat: 24.874412617545623, lon: 90.72630800435633 }, 'H': { lat: 24.874412617545623, lon: 90.72630800435633 },
        'I': { lat: 24.870244996837823, lon: 90.72888132954647 }, 'J': { lat: 24.85963521941139, lon: 90.73166942634121 },
        'K': { lat: 24.887243559210333, lon: 90.73722717166535 }, 'L': { lat: 24.893672597624974, lon: 90.73924260466777 } 
    };

    // ভাড়ার ডেটাবেস
    const fareOverrides = {
        "A-B_auto": 5, "A-C_auto": 10, "A-D_auto": 10, "A-E_auto": 15, "A-F_auto": 15, "A-G_auto": 20, "A-H_auto": 20, "A-J_auto": 20, "A-K_auto": 15, "A-L_auto": 20,
        "A-C_rickshaw": 20, "A-D_rickshaw": 30, "A-E_rickshaw": 30, "A-F_rickshaw": 30, "A-G_rickshaw": 30, "A-H_rickshaw": 30, "A-I_rickshaw": 15, "A-J_rickshaw": 40, "A-K_rickshaw": 30, "A-L_rickshaw": 40,
        "B-C_auto": 5, "B-D_auto": 10, "B-E_auto": 10, "B-F_auto": 15, "B-G_auto": 15, "B-H_auto": 20, "B-I_auto": 15, "B-J_auto": 20, "B-K_auto": 10, "B-L_auto": 20,
        "B-D_rickshaw": 20, "B-E_rickshaw": 20, "B-F_rickshaw": 30, "B-G_rickshaw": 30, "B-H_rickshaw": 30, "B-I_rickshaw": 30, "B-J_rickshaw": 40, "B-K_rickshaw": 20, "B-L_rickshaw": 30,
        "C-D_auto": 5, "C-E_auto": 10, "C-F_auto": 10, "C-G_auto": 10, "C-H_auto": 15, "C-I_auto": 10, "C-J_auto": 15, "C-K_auto": 5, "C-L_auto": 10,
        "C-D_rickshaw": 20, "C-E_rickshaw": 20, "C-F_rickshaw": 30, "C-G_rickshaw": 30, "C-H_rickshaw": 30, "C-I_rickshaw": 30, "C-J_rickshaw": 40, "C-K_rickshaw": 20, "C-L_rickshaw": 30,
        "D-E_auto": 5, "D-F_auto": 10, "D-G_auto": 10, "D-H_auto": 15, "D-I_auto": 10, "D-J_auto": 15, "D-K_auto": 5, "D-L_auto": 10,
        "D-E_rickshaw": 20, "D-F_rickshaw": 20, "D-G_rickshaw": 30, "D-H_rickshaw": 25, "D-I_rickshaw": 30, "D-J_rickshaw": 30, "D-L_rickshaw": 20,
        "E-F_auto": 5, "E-G_auto": 5, "E-H_auto": 10, "E-I_auto": 10, "E-J_auto": 10, "E-K_auto": 10, "E-L_auto": 15,
        "E-F_rickshaw": 20, "E-H_rickshaw": 20, "E-I_rickshaw": 20, "E-J_rickshaw": 30, "E-K_rickshaw": 20, "E-L_rickshaw": 30,
        "F-G_auto": 5, "F-H_auto": 10, "F-I_auto": 5, "F-J_auto": 10, "F-K_auto": 10, "F-L_auto": 15,
        "F-H_rickshaw": 20, "F-J_rickshaw": 20, "F-K_rickshaw": 20, "F-L_rickshaw": 30,
        "G-H_auto": 5, "G-I_auto": 5, "G-J_auto": 10, "G-K_auto": 10, "G-L_auto": 15,
        "G-I_rickshaw": 20, "G-J_rickshaw": 30, "G-K_rickshaw": 30, "G-L_rickshaw": 40,
        "H-I_auto": 10, "H-J_auto": 20, "H-K_auto": 15, "H-L_auto": 20,
        "H-I_rickshaw": 20, "H-J_rickshaw": 30, "H-K_rickshaw": 30, "H-L_rickshaw": 40,
        "I-J_auto": 10, "I-K_auto": 10, "I-L_auto": 20,
        "I-J_rickshaw": 20, "I-K_rickshaw": 30, "I-L_rickshaw": 40,
        "J-K_auto": 15, "J-L_auto": 20,
        "J-K_rickshaw": 30, "J-L_rickshaw": 40,
        "K-L_auto": 10, "K-L_rickshaw": 20
    };

    const RICKSHAW_MULTIPLIER = 1.8; const BASE_FARE_AUTO = 15; const PER_ZONE_FARE_AUTO = 10; const ADDON_PER_KM = 10; const FREE_ALLEY_RADIUS = 200;

    function setVehicle(type) {
        selectedVehicle = type;
        const btn = document.getElementById('calcBtn'); const resBox = document.getElementById('resultBox');
        document.getElementById('labelAuto').className = "vehicle-option"; document.getElementById('labelRickshaw').className = "vehicle-option";
        resBox.className = "result-box"; btn.className = "";
        if (type === 'auto') { document.getElementById('labelAuto').classList.add('active-auto'); btn.innerText = 'অটো ভাড়া বের করুন'; btn.classList.add('btn-auto'); resBox.classList.add('auto-result'); }
        else { document.getElementById('labelRickshaw').classList.add('active-rickshaw'); btn.innerText = 'রিকশা ভাড়া বের করুন'; btn.classList.add('btn-rickshaw'); resBox.classList.add('rickshaw-result'); }
        document.getElementById('resultBox').style.display = 'none';
    }

    function toBanglaNum(num) { const d = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']; return num.toString().replace(/\d/g, c => d[c]); }

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371.0; const dLat = (lat2 - lat1) * Math.PI / 180; const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function calculateFare() {
        const sId = document.getElementById('startZone').value; const eId = document.getElementById('endZone').value;
        const pM = parseInt(document.getElementById('pickupAlley').value) || 0; const dM = parseInt(document.getElementById('dropoffAlley').value) || 0;
        const sk = [sId, eId].sort(); const rk = `${sk[0]}-${sk[1]}_${selectedVehicle}`;
        let mf = 0, isF = false;
        if (fareOverrides[rk] !== undefined) { mf = fareOverrides[rk]; isF = true; }
        else { if (sId !== eId) { const dk = haversine(zones[sId].lat, zones[sId].lon, zones[eId].lat, zones[eId].lon); mf = BASE_FARE_AUTO + (Math.max(1, Math.round(dk / 0.5)) * PER_ZONE_FARE_AUTO); } else { mf = BASE_FARE_AUTO; } if (selectedVehicle === 'rickshaw') { mf = Math.ceil(mf * RICKSHAW_MULTIPLIER); } }
        let aa = 0; let pe = (pM > FREE_ALLEY_RADIUS) ? ((pM - FREE_ALLEY_RADIUS) / 1000) * ADDON_PER_KM : 0; let de = (dM > FREE_ALLEY_RADIUS) ? ((dM - FREE_ALLEY_RADIUS) / 1000) * ADDON_PER_KM : 0;
        aa = Math.ceil((pe + de) * (selectedVehicle === 'rickshaw' ? 1.5 : 1)); let tf = Math.ceil(mf + aa);
        document.getElementById('resultBox').style.display = 'block'; document.getElementById('totalFare').innerText = toBanglaNum(tf) + " টাকা";
        let vn = selectedVehicle === 'auto' ? 'অটো' : 'রিকশা'; let dt = `${vn} ভাড়া: ${toBanglaNum(mf)} টাকা`;
        if(aa > 0) dt += ` | গলির অ্যাড-অন: +${toBanglaNum(aa)} টাকা`; if(isF) dt += " (ফিক্সড রুট)"; document.getElementById('fareBreakdown').innerText = dt;
    }

    function toggleComplainBox() { const b = document.getElementById('complainBox'); b.style.display = b.style.display === 'block' ? 'none' : 'block'; updateComplainRoute(); }
    function updateComplainRoute() { const sn = document.getElementById('startZone').options[document.getElementById('startZone').selectedIndex].text; const en = document.getElementById('endZone').options[document.getElementById('endZone').selectedIndex].text; document.getElementById('cRoute').value = `${sn} ➔ ${en}`; }
    function previewImage(e) { const f = e.target.files[0]; if(f){ const r = new FileReader(); r.onload = (ev) => { document.getElementById('imgPreview').src = ev.target.result; document.getElementById('imgPreview').style.display = 'block'; }; r.readAsDataURL(f); } }

    // সুপাবেসে ছবি আপলোড ও মেইল পাঠানোর মূল ফাংশন
    async function handleSupabaseSubmit() {
        const name = document.getElementById('cName').value.trim(); const phone = document.getElementById('cPhone').value.trim();
        const route = document.getElementById('cRoute').value; const vType = document.getElementById('cVehicleType').value;
        const details = document.getElementById('cDetails').value.trim(); const file = document.getElementById('cPic').files[0];
        const btn = document.getElementById('submitBtn'); const msg = document.getElementById('statusMsg');

        if(!name || !phone || !file) { alert("নাম, মোবাইল এবং নম্বর প্লেটের ছবি আবশ্যক!"); return; }

        btn.disabled = true; btn.innerText = "ছবি আপলোড হচ্ছে..."; msg.style.display = "block"; msg.className = "error"; msg.innerText = "সুপাবেসে ছবি পাঠানো হচ্ছে, অপেক্ষা করুন...";

        try {
            const ext = file.name.split('.').pop(); const fName = `${phone}_${Date.now()}.${ext}`;
            
            // ছবি আপলোড
            const { error: uploadErr } = await db.storage.from('complaint-photos').upload(fName, file);
            if (uploadErr) throw uploadErr;

            // ছবির পাবলিক লিংক তৈরি
            const { data: urlData } = db.storage.from('complaint-photos').getPublicUrl(fName);
            const imgUrl = urlData.publicUrl;

            // ডেটাবেসে সেভ
            const { error: dbErr } = await db.from('complaints').insert([{ name, phone, route, vehicle_type: vType, message: details, image_url: imgUrl }]);
            if (dbErr) throw dbErr;

            // জিমেইল ওপেন করা
            msg.className = "success"; msg.innerText = "✅ সফল! এখন জিমেইল ওপেন হচ্ছে...";
            const subject = "জরুরি: নেত্রকোনায় " + vType + " চালকের অতিরিক্ত ভাড়ার অভিযোগ";
            const body = "জনাব,\n\nআমি " + name + ", মোবাইল: " + phone + "। রুট: " + route + "। গাড়ি: " + vType + "।\n\nবিবরণ: " + (details || 'চালক অতিরিক্ত ভাড়া দাবি করেছে।') + "\n\nনম্বর প্লেটের ছবি নিচের লিংকে (ক্লিক করলেই ছবি দেখাবে):\n" + imgUrl + "\n\nদ্রুত ব্যবস্থা নেওয়ার জন্য অনুরোধ।\n\nবিনীত: " + name;
            
            window.location.href = "mailto:shahriyarslab@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        } catch (error) {
            msg.className = "error"; msg.innerText = "❌ ত্রুটি: " + error.message;
        } finally {
            btn.disabled = false; btn.innerText = "📧 ছবি আপলোড ও মডেল থানায় পাঠান";
        }
    }
    window.onload = updateComplainRoute;

