Documents = new FS.Collection("documents", {
  stores: [new FS.Store.FileSystem("documents", { path: "~/uploads/documents" })]
});

Documents.allow({
  insert: () => true,
  update: () => true,
  remove: () => true,
  download: () => true
});