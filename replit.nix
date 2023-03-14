{ pkgs }: {
	deps = [
		pkgs.android-tools
  pkgs.zulu
  pkgs.sudo
  pkgs.nodejs-16_x
        pkgs.nodePackages.typescript-language-server
        pkgs.yarn
        pkgs.replitPackages.jest
	];
}