/*
 * =====================================================================
 *  tasks-config.js  —  EDIT THIS FILE TO CHANGE WORDING / IMAGES / DAYS
 * =====================================================================
 *
 * This is the ONLY file you should need to touch to change what the
 * app asks, in what words, with which picture, or on which day.
 * You do NOT need to know programming to edit this — just be careful
 * to keep the punctuation ( { } [ ] , " ) exactly as it is.
 *
 * Each task is one block like this:
 *
 *   {
 *     id: "kitchen_slab",              <- unique name, do not change/duplicate
 *     textHi: "क्या आपने ... ?",         <- the Hindi sentence that gets SPOKEN ALOUD
 *     image: "kitchen_slab.svg",       <- picture file, must exist in images/ folder
 *     day: ["everyday"]                <- when this task should be asked
 *   },
 *
 * WHAT YOU CAN CHANGE SAFELY:
 *   - textHi   : rewrite the Hindi sentence however you like. Keep it short
 *                and simple since it is read aloud by the phone, not written.
 *   - image    : point to any .svg file placed inside the images/ folder.
 *   - day      : a list (inside square brackets) made of any of these words:
 *                  "everyday"  -> asked every single day
 *                  "monday", "tuesday", "wednesday", "thursday",
 *                  "friday", "saturday", "sunday"
 *                You can list more than one day, e.g. ["monday","tuesday"]
 *                if the same task should be asked on both those days.
 *
 * WHAT NOT TO CHANGE:
 *   - id       : must stay unique (no two tasks with the same id). This is
 *                used internally and is also the label saved in the Google
 *                Sheet log, so changing it later will look like a "new" task
 *                in your records.
 *
 * ORDER MATTERS: tasks are asked in the exact order they appear in this
 * file (everyday tasks first, then that day's extra tasks), so keep the
 * "everyday" tasks at the top in the order you want them asked.
 *
 * To ADD a brand-new task: copy one whole { ... } block, paste it before
 * the closing "];" below, give it a new unique id, and fill in the fields.
 * To REMOVE a task: delete its whole { ... } block (including the comma).
 * =====================================================================
 */

const TASKS = [

  // ------------------- EVERYDAY TASKS (asked every day, in this order) -------------------

  {
    id: "kitchen_slab",
    textHi: "क्या आपने किचन का स्लैब साफ किया?",
    image: "kitchen_slab.svg",
    day: ["everyday"]
  },
  {
    id: "utensils_put_back",
    textHi: "क्या बर्तन धोकर सही जगह पर रख दिए?",
    image: "utensils_put_back.svg",
    day: ["everyday"]
  },
  {
    id: "window_sill",
    textHi: "क्या खिड़की की चौखट पर झाड़ू लगाई?",
    image: "window_sill.svg",
    day: ["everyday"]
  },
  {
    id: "fold_clothes",
    textHi: "क्या कपड़े तह करके रखे?",
    image: "fold_clothes.svg",
    day: ["everyday"]
  },
  {
    id: "make_bed",
    textHi: "क्या बिस्तर ठीक करके लगाया?",
    image: "make_bed.svg",
    day: ["everyday"]
  },
  {
    id: "dustbin",
    textHi: "क्या कूड़ेदान बाहर रखकर नया बैग लगाकर वापस लाए?",
    image: "dustbin.svg",
    day: ["everyday"]
  },
  {
    id: "broom_corners",
    textHi: "क्या घर के कोनों में झाड़ू लगाई?",
    image: "broom_corners.svg",
    day: ["everyday"]
  },
  {
    id: "dust_sofa",
    textHi: "क्या सोफे की धूल साफ की?",
    image: "dust_sofa.svg",
    day: ["everyday"]
  },
  {
    id: "washroom_taps",
    textHi: "क्या वॉशरूम के नल और सतह साफ की?",
    image: "washroom_taps.svg",
    day: ["everyday"]
  },
  {
    id: "balcony_bookshelf",
    textHi: "क्या बालकनी और किताबों की अलमारी पर झाड़ू लगाई?",
    image: "balcony_bookshelf.svg",
    day: ["everyday"]
  },

  // ------------------- MONDAY & TUESDAY EXTRA TASKS -------------------

  {
    id: "toothbrush_rack",
    textHi: "क्या टूथब्रश रखने की जगह साफ की?",
    image: "toothbrush_rack.svg",
    day: ["monday", "tuesday"]
  },
  {
    id: "soap_rack",
    textHi: "क्या साबुन रखने की जगह साफ की?",
    image: "soap_rack.svg",
    day: ["monday", "tuesday"]
  },
  {
    id: "toilet_seat",
    textHi: "क्या टॉयलेट सीट साफ की?",
    image: "toilet_seat.svg",
    day: ["monday", "tuesday"]
  },

  // ------------------- WEDNESDAY EXTRA TASKS -------------------

  {
    id: "windows_clean",
    textHi: "क्या खिड़कियाँ साफ कीं?",
    image: "windows_clean.svg",
    day: ["wednesday"]
  },
  {
    id: "mirrors_clean",
    textHi: "क्या शीशे साफ किए?",
    image: "mirrors_clean.svg",
    day: ["wednesday"]
  },
  {
    id: "doors_clean",
    textHi: "क्या दरवाज़े साफ किए?",
    image: "doors_clean.svg",
    day: ["wednesday"]
  },

  // ------------------- THURSDAY EXTRA TASKS -------------------

  {
    id: "wash_clothes_bin",
    textHi: "क्या टोकरी में रखे कपड़े धोए?",
    image: "wash_clothes_bin.svg",
    day: ["thursday"]
  },
  {
    id: "dry_washed_clothes",
    textHi: "क्या धुले हुए कपड़े सुखाने के लिए डाले?",
    image: "dry_washed_clothes.svg",
    day: ["thursday"]
  },

  // ------------------- FRIDAY EXTRA TASKS -------------------

  {
    id: "cupboards_clean",
    textHi: "क्या अलमारियाँ साफ कीं?",
    image: "cupboards_clean.svg",
    day: ["friday"]
  },
  {
    id: "bags_clean",
    textHi: "क्या बैग साफ किए?",
    image: "bags_clean.svg",
    day: ["friday"]
  },
  {
    id: "fridge_clean",
    textHi: "क्या फ्रिज साफ किया?",
    image: "fridge_clean.svg",
    day: ["friday"]
  },
  {
    id: "dry_wm_clothes",
    textHi: "क्या वॉशिंग मशीन के कपड़े सुखाने के लिए डाले?",
    image: "dry_wm_clothes.svg",
    day: ["friday"]
  },

  // ------------------- SATURDAY EXTRA TASKS -------------------

  {
    id: "utensils_deep_clean",
    textHi: "क्या सारे बर्तन अच्छी तरह माँजे?",
    image: "utensils_deep_clean.svg",
    day: ["saturday"]
  },

  // ------------------- SUNDAY EXTRA TASKS -------------------

  {
    id: "dust_all_surfaces",
    textHi: "क्या सारी सतहों की धूल साफ की?",
    image: "dust_all_surfaces.svg",
    day: ["sunday"]
  },
  {
    id: "deep_clean_room",
    textHi: "क्या किसी एक कमरे की गहरी सफाई की?",
    image: "deep_clean_room.svg",
    day: ["sunday"]
  }

];

// Do not remove the line below — app.js needs it to read this file
// when the app is opened directly as index.html (no server/bundler).
if (typeof module !== "undefined") { module.exports = TASKS; }
