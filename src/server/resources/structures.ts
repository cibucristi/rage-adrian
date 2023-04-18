/* --- VARIABLES --- */
let enums: any = {};


/* --- RESET ARRAYS --- */
enums.jobs = new Array(999);
enums.bizz = new Array(999);

/* --- LOOPS --- */
for (let i = 0; i <= 999; i++) {

    enums.jobs[i] = {

        job_id: 0,
        job_level: 0,
        job_icon: -1,
        job_icon_color: -1,
        job_map_icon: -1,
        job_balance: 0,

        job_have_work: false,
        job_status: false,
        job_owned: false,

        job_min_money: {
            skill1: 0,
            skill2: 0,
            skill3: 0,
            skill4: 0,
            skill5: 0
        },
        job_max_money: {
            skill1: 0,
            skill2: 0,
            skill3: 0,
            skill4: 0,
            skill5: 0
        },

        job_name: new Array(999),
        job_owner: new Array(999),
        job_description: new Array(999),
        job_3d_text: new Array(999),
        job_pickup: new Array(999),

        job_pos_x: new mp.Vector3(1.1, 1.1, 1.1),
        job_pos_y: new mp.Vector3(1.1, 1.1, 1.1),
        job_pos_z: new mp.Vector3(1.1, 1.1, 1.1),

        /* --- WORK --- */
        job_work_name: new Array(999),
        job_work_3d_text: new Array(999),
        job_work_pickup: new Array(999),

        job_work_pos_x: new mp.Vector3(1.1, 1.1, 1.1),
        job_work_pos_y: new mp.Vector3(1.1, 1.1, 1.1),
        job_work_pos_z: new mp.Vector3(1.1, 1.1, 1.1)
    }
    enums.bizz[i] = {

        bizz_id: 0,
        bizz_level: 0,
        bizz_price: 0,
        bizz_balance: 0,
        bizz_type: 0,
        bizz_icon: 0,
        bizz_icon_color: 0,

        bizz_map_icon: -1,
        bizz_pickup: -1,

        bizz_pos_x: new mp.Vector3(1.1, 1.1, 1.1),
        bizz_pos_y: new mp.Vector3(1.1, 1.1, 1.1),
        bizz_pos_z: new mp.Vector3(1.1, 1.1, 1.1),

        bizz_description: new Array(999),
        bizz_owner: new Array(999),
        bizz_3d_text: new Array(999),

        bizz_status: false,
        bizz_owned: false,

    }
}

export { enums }