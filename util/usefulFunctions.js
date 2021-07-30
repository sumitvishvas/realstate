
const spaceReplacer=(str)=>{
    str = str.trim().replace(/\s+/g, "-");
    return str;
}

module.exports=spaceReplacer;