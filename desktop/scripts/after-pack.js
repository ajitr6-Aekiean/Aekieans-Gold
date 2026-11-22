// Sets the nusta icon and version details on the Windows .exe (no Wine needed).
const fs = require('fs'), path = require('path');
exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== 'win32') return;
  const ResEdit = await import('resedit'); const PE = await import('pe-library');
  const { productFilename } = ctx.packager.appInfo; const version = ctx.packager.appInfo.version;
  const exe = path.join(ctx.appOutDir, `${productFilename}.exe`);
  const res = ResEdit.NtExecutableResource.from(PE.NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true }));
  const exeObj = PE.NtExecutable.from(fs.readFileSync(exe), { ignoreCert: true }); const r = ResEdit.NtExecutableResource.from(exeObj);
  const ico = ResEdit.Data.IconFile.from(fs.readFileSync(path.join(__dirname, '..', 'build', 'icon.ico')));
  const groups = ResEdit.Resource.IconGroupEntry.fromEntries(r.entries);
  const gid = groups.length ? groups[0].id : 1, lang = groups.length ? groups[0].lang : 1033;
  ResEdit.Resource.IconGroupEntry.replaceIconsForResource(r.entries, gid, lang, ico.icons.map(i => i.data));
  const vi = ResEdit.Resource.VersionInfo.fromEntries(r.entries)[0];
  if (vi){
    const [a,b,c] = version.split('.').map(Number);
    vi.setFileVersion(a,b,c,0,1033); vi.setProductVersion(a,b,c,0,1033);
    vi.setStringValues({ lang:1033, codepage:1200 }, { ProductName:'nusta Arena Planner', FileDescription:'nusta Arena Planner', CompanyName:'nusta', LegalCopyright:'© nusta', OriginalFilename:`${productFilename}.exe`, InternalName:'nusta Arena Planner' });
    vi.outputToResourceEntries(r.entries);
  }
  r.outputResource(exeObj); fs.writeFileSync(exe, Buffer.from(exeObj.generate()));
  console.log('  • nusta icon and version info set on', path.basename(exe));
};
