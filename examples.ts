Deno.chdir("examples");

const command = new Deno.Command("deno", {
  args: [
    "task",
    "dev",
  ],
});

command.spawn();
