// 预置脚本配置（问答对）
// - triggers: 触发问题（精确匹配）
// - explanation/loading/summary: 输出流程顺序
// - table: 表格列与行数据（支持 randomRows 动态生成）
// - rdSpace: 预留与研发空间联动的入口（如后续需要）
window.PRESET_SCRIPTS = [
    {
        id: 'infineon_mos_low_rds',
        match: 'exact',
        triggers: ['品牌为英飞凌，内阻小于 100mΩ的mos'],
        preLoadingText: '正在理解用户意图',
        preLoadingDelay: 3000,
        explanation: '收到需求，我将为你查询满足“英飞凌品牌、Rds(on) < 100mΩ”的MOS物料，并整理关键参数供你参考。',
        loadingText: '正在筛选匹配物料...',
        loadingDelay: 3000,
        table: {
            title: '物料清单（mosfet）',
            columns: [
                { key: 'brand', label: '品牌' },
                { key: 'model', label: '型号' },
                { key: 'rds', label: 'Rds(on) (mΩ@10V)' },
                { key: 'vds', label: 'Vds (V)' },
                { key: 'id', label: 'Id (A)' },
                { key: 'pkg', label: '封装' },
                { key: 'code', label: '物料编码' }
            ],
            randomRows: 14
        },
        followupLoadingText: '正在理解查询结果',
        followupDelay: 3000,
        summary: '本次共匹配 {count} 条物料数据，已按Rds(on)从低到高整理。请告诉我你的应用场景、封装限制或电流需求，我可以继续给出更精确的选型建议。'
    },
    {
        id: 'bom_generation_form',
        type: 'bom_form',
        match: 'exact',
        triggers: ['基于产品需求，生成BOM'],
        // BOM脚本：双loading -> 说明 -> 生成可编辑确认单（提交后触发任务进度/BOM联动）
        preLoadings: [
            { text: '正在阅读文档', delay: 3000 },
            { text: '正在理解用户意图', delay: 3000 }
        ],
        explanation: '已理解当前BOM目标：基于产品需求梳理关键器件并生成可选清单。请先确认每类物料的约束（性能指标、封装/尺寸、国产化要求、认证等级与供货风险等）。确认后我将启动BOM编制任务。',
        loadingText: '正在生成物料需求表单',
        loadingDelay: 3000,
        form: {
            title: '物料需求确认单',
            types: [
                { value: 'mosfet', label: 'MOSFET' },
                { value: 'diode', label: '二极管' },
                { value: 'mcu', label: 'MCU' },
                { value: 'dcdc', label: 'DC-DC电源' },
                { value: 'ldo', label: 'LDO稳压' },
                { value: 'resistor', label: '电阻' },
                { value: 'capacitor', label: '电容' },
                { value: 'driver', label: '驱动器' },
                { value: 'interface', label: '接口芯片' }
            ],
            rows: [
                {
                    type: 'mosfet',
                    desc: 'N沟道，Vds≥30V，Id≥12A，Rds(on)≤20mΩ，优先车规/工业级，封装尽量小型化'
                },
                {
                    type: 'diode',
                    desc: '肖特基二极管，Vr≥40V，If≥3A，低正向压降，SMA/SMB封装'
                },
                {
                    type: 'dcdc',
                    desc: '输入9–36V，输出5V/2A，效率≥90%，EMI表现好，支持同步整流'
                }
            ]
        }
    }
];
