<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pages = [
            [
                'title' => 'ทำเนียบโครงสร้างการบริหาร',
                'slug' => 'leadership',
                'category' => 'about',
                'content_md' => "## โครงสร้างการบริหาร\n\n- ผู้อำนวยการโรงพยาบาล\n- รองผู้อำนวยการฝ่ายการแพทย์\n- คณะกรรมการบริหารตามสายงาน",
            ],
            [
                'title' => 'ประวัติโรงพยาบาล',
                'slug' => 'history',
                'category' => 'about',
                'content_md' => "## เส้นทางการก่อตั้ง\n\n- ก่อตั้งเมื่อ พ.ศ. 2500\n- พัฒนาสู่ศูนย์การแพทย์ภูมิภาค\n- ยึดหลักการดูแลแบบองค์รวม",
            ],
            [
                'title' => 'วิสัยทัศน์/พันธกิจ/ค่านิยม',
                'slug' => 'vision-mission-values',
                'category' => 'about',
                'content_md' => "## วิสัยทัศน์\n\n- โรงพยาบาลชั้นนำด้านสุขภาพจิต\n\n## พันธกิจ\n\n- ให้บริการที่มีคุณภาพ\n- พัฒนาศักยภาพบุคลากร\n\n## ค่านิยม\n\n- ผู้ป่วยเป็นศูนย์กลาง\n- โปร่งใส ตรวจสอบได้",
            ],
            [
                'title' => 'ผลงานวิชาการ',
                'slug' => 'publications',
                'category' => 'academic',
                'content_md' => "## ผลงานเด่น\n\n- งานวิจัยสุขภาพจิตชุมชน\n- ตีพิมพ์วารสารนานาชาติ\n- โครงการวิจัยร่วมกับเครือข่าย",
            ],
            [
                'title' => 'ชมรมจริยธรรม',
                'slug' => 'ethics-club',
                'category' => 'academic',
                'content_md' => "## กิจกรรมชมรม\n\n- เวทีแลกเปลี่ยนเรียนรู้\n- อบรมจริยธรรมประจำปี\n- เครือข่ายอาสาสมัครจริยธรรม",
            ],
            [
                'title' => 'Health Rider',
                'slug' => 'health-rider',
                'category' => 'programs',
                'content_md' => "## บริการ Health Rider\n\n- ส่งยาถึงบ้านผู้ป่วยเรื้อรัง\n- มีระบบติดตามสถานะการจัดส่ง\n- ทีมสหวิชาชีพให้คำปรึกษาทางไกล",
            ],
            [
                'title' => 'ลดการตีตราและเลือกปฏิบัติ',
                'slug' => 'anti-stigma',
                'category' => 'programs',
                'content_md' => "## โครงการลดการตีตรา\n\n- จัดอบรมสร้างความเข้าใจ\n- ทำงานร่วมกับผู้นำชุมชน\n- ติดตามผลกระทบเชิงสังคม",
            ],
            [
                'title' => 'ข้อมูล พรบ',
                'slug' => 'acts',
                'category' => 'legal',
                'content_md' => "## รวมข้อมูลกฎหมาย\n\n- พระราชบัญญัติสุขภาพจิต\n- สิทธิและหน้าที่ของผู้รับบริการ\n- ช่องทางให้คำปรึกษากฎหมาย",
            ],
            [
                'title' => 'จัดซื้อจัดจ้าง/ข่าวสาร ITA',
                'slug' => 'procurement-ita',
                'category' => 'procurement',
                'content_md' => "## ข้อมูลงานจัดซื้อ\n\n- แผนการจัดซื้อจัดจ้างประจำปี\n- ข่าวสารความโปร่งใส ITA\n- ช่องทางร้องเรียนทุจริต",
            ],
            [
                'title' => 'บริการออนไลน์',
                'slug' => 'online-services',
                'category' => 'services',
                'content_md' => "## บริการออนไลน์สำหรับประชาชน\n\n- ขอประวัติการรักษา\n- ลงทะเบียนบริจาค\n- ประเมินความพึงพอใจ",
            ],
            [
                'title' => 'ขอประวัติการรักษา',
                'slug' => 'medical-record-request',
                'category' => 'services',
                'content_md' => "## ขั้นตอนการขอประวัติ\n\n- กรอกแบบฟอร์มออนไลน์\n- แนบเอกสารยินยอม\n- เจ้าหน้าที่ติดต่อกลับภายใน 3 วันทำการ",
            ],
            [
                'title' => 'การรับบริจาค',
                'slug' => 'donation',
                'category' => 'donation',
                'content_md' => "## ช่องทางการบริจาค\n\n- โอนเงินผ่านธนาคาร\n- สแกน QR Code\n- ร่วมสนับสนุนอุปกรณ์การแพทย์",
            ],
            [
                'title' => 'ประเมินความพึงพอใจ',
                'slug' => 'satisfaction',
                'category' => 'feedback',
                'content_md' => "## แบบประเมินบริการ\n\n- ประเมินการให้บริการ\n- ความสะอาดและความปลอดภัย\n- รับฟังข้อเสนอแนะเพิ่มเติม",
            ],
            [
                'title' => 'ระบบเบิกจ่ายน้ำมัน',
                'slug' => 'fuel-claims',
                'category' => 'internal',
                'content_md' => "## ระบบสำหรับบุคลากร\n\n- ต้องเข้าสู่ระบบก่อนใช้งาน\n- บันทึกข้อมูลการเดินทาง\n- ติดตามสถานะการอนุมัติ",
            ],
            [
                'title' => 'ศูนย์จัดเก็บเอกสาร',
                'slug' => 'archive-center',
                'category' => 'internal',
                'content_md' => "## ระบบศูนย์เอกสาร\n\n- ขอเบิกแฟ้มเวชระเบียน\n- ระบุวันที่ต้องการใช้งาน\n- แจ้งเตือนสถานะผ่านอีเมลภายใน",
            ],
        ];

        $now = now();

        foreach ($pages as $page) {
            Page::updateOrCreate(
                ['slug' => $page['slug']],
                [
                    'title' => $page['title'],
                    'category' => $page['category'],
                    'content_md' => $page['content_md'],
                    'status' => 'published',
                    'published_at' => $now,
                ]
            );
        }
    }
}
